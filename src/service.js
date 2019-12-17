const fs = require('fs');
const { Summary, Gauge } = require('prome-string');
const { loop, request } = require('./utils');

// ============================================================================
class Service {
  constructor({
    name,
    percentiles = [0.5],
    span = 24 * 3600,
    interval = 60,
    filename,
  } = {}) {
    this.interval = interval;
    this.filename = filename;

    this._table = {}; // {string:{handler:Object, info:object}, }

    this._summary = new Summary({
      name: `${name}_summary`,
      help: `help of "${name}"`,
      labels: ['id', 'url', 'status'],
      queueLength: Math.ceil(span / interval),
      percentiles,
      timeout: span * 1000,
    });

    this._gauge = new Gauge({
      name: `${name}_gauge`,
      help: `help of "${name}"`,
      labels: ['id', 'url', 'status'],
    });
  }

  save() {
    const lookList = Object.values(this._table).map(({ info }) => info);
    fs.writeFileSync(this.filename, JSON.stringify(lookList, null, 2));
  }

  load(filename = this.filename) {
    if(fs.existsSync(filename)) {
      const lookList = require(filename);
      lookList.map(v => this.look(v));
    }
  }

  metrics() {
    return [this._gauge, this._summary].join('\n');
  }

  list() {
    return Object.keys(this._table);
  }

  get(id) {
    const { info } = this._table[id] || {};
    return info || null;
  }

  del(id) {
    const { handler } = this._table[id] || {};
    if (handler) {
      handler.stop();
      delete this._table[id];
      this.save();
    }
    return null;
  }

  look(info) {
    const { id, url, interval } = info;

    if (id in this._table) {
      throw new Error(`id "${id}" already exist`);
    }

    const handler = loop(
      async () => {
        const timestamp = Date.now();
        const { status = null } = await request(info) || {};
        const duration = Date.now() - timestamp;
        this._summary.set(duration, { id, url, status });
        this._gauge.set(duration, { id, url, status });
        // console.log({ url, status, timestamp, duration });
      },
      interval || this.interval,
    );

    this._table[id] = { handler, info };
    this.save();
    return id;
  }
}

module.exports = Service;

const { Summary } = require('prome-string');
const { loop, request } = require('./utils');

// ============================================================================
class Service {
  constructor({
    name,
    percentiles = [0.5],
    span = 24 * 3600,
    interval = 60,
  } = {}) {
    if (!name) {
      throw new Error(`name is required, got "${name}"`);
    }

    this.interval = interval;

    this._table = {}; // {string:{handler:Object, info:object}, }
    this._summary = new Summary({
      name: name,
      help: `help of "${name}"`,
      labels: ['id', 'url', 'status'],
      queueLength: Math.ceil(span / interval),
      percentiles,
      timeout: span * 1000,
    });
  }

  metrics() {
    return this._summary.toString();
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
        // console.log({ url, status, timestamp, duration });
      },
      interval || this.interval,
    );

    this._table[id] = { handler, info };
    return id;
  }
}

module.exports = Service;

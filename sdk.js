const { request } = require('./src/utils');

class SDK {
  constructor({ url }) {
    this.url = url;
  }

  async metrics() {
    const { status, text } = await request({
      method: 'GET',
      url: `${this.url}/metrics`,
    });

    switch (status) {
      case 200:
        return text;

      default:
        throw new Error(text);
    }
  }

  async look(info) {
    const { status, text } = await request({
      method: 'POST',
      url: `${this.url}/look`,
      body: info,
    });

    switch (status) {
      case 200:
        return text;

      default:
        throw new Error(text);
    }
  }

  async list() {
    const { status, text, body } = await request({
      method: 'GET',
      url: `${this.url}/look`,
    });

    switch (status) {
      case 200:
        return body;

      default:
        throw new Error(text);
    }
  }

  async get(id) {
    const { status, text, body } = await request({
      method: 'GET',
      url: `${this.url}/look/${id}`,
    });

    switch (status) {
      case 200:
        return body;

      case 204:
        return null;

      default:
        throw new Error(text);
    }
  }

  async del(id) {
    const { status, text } = await request({
      method: 'DELETE',
      url: `${this.url}/look/${id}`,
    });

    switch (status) {
      case 204:
        return null;

      default:
        throw new Error(text);
    }
  }
}

module.exports = SDK;

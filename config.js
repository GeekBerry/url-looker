module.exports = {
  port: 80,

  name: 'url_looker',
  percentiles: [0.5, 0.8, 0.9, 0.99],
  span: 6 * 3600,
  interval: 15,

  look: [
    // self metric
    {
      id: 'url-looker',
      url: 'http://127.0.0.1:80',
    },
  ],
};

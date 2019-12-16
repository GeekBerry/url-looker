const Bin = require('./src');

const app = new Bin({
  name: 'url_looker',
  interval: 60,
  percentiles: [0.5, 0.8, 0.9, 0.99],
  port: 80,
});

app.listen();

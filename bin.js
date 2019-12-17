const App = require('./src');

const app = new App({
  name: 'url_looker',
  percentiles: [0.5, 0.8, 0.9, 0.99],
  span: 1800,
  interval: 15,
  filename: `${__dirname}/look.json`
});

app.listen(80);

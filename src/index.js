const Koaflow = require('koaflow');
const Service = require('./service');
const router = require('./router');

class App extends Koaflow {
  constructor(config = {}) {
    super();

    this.config = config;
    this.service = new Service(config);
    this.router = router; // equal as `this.router.subRouter('', router);`

    this.use(async (ctx, next) => {
      try {
        await next();
      } catch (e) {
        ctx.status = 600;
        ctx.body = e.message;
      }
    });
  }

  listen() {
    const port = this.config.port || 80;

    super.listen(port);
    console.log(`listen at ${port}`);
  }
}

module.exports = App;

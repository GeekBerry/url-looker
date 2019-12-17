const Koaflow = require('koaflow');
const Service = require('./service');
const router = require('./router');

class App extends Koaflow {
  constructor(config = {}) {
    super();

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

  listen(port = 80) {
    super.listen(port);
    this.service.load();
    console.log(`listen at ${port}`);
  }
}

module.exports = App;

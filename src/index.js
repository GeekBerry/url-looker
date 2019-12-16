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
    const {
      config: { port = 80, look = [] },
    } = this;

    super.listen(port);
    look.map(v => this.service.look(v)); // load const metric items

    console.log(`listen at ${port}`);
  }
}

module.exports = App;

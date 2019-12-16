const Koaflow = require('koaflow');
const type = require('koaflow-type');

const router = new Koaflow.Router();

// health
router.getFlow('/', () => Date.now());

// prometheus
router.getFlow('/metrics',
  function () {
    const {
      app: { service },
    } = this;

    return service.metrics();
  },
);

router.postFlow('/look',
  type({
    id: { path: 'request.body', type: type.str, required: true },
    url: { path: 'request.body', type: type.url, required: true },
    method: { path: 'request.body', type: type.str, 'enum': v => ['GET', 'POST', 'HEAD'].includes(v) },
    query: { path: 'request.body', type: type.object },
    header: { path: 'request.body', type: type.object },
    body: { path: 'request.body', type: type.object },
    interval: { path: 'request.body', type: type.integer },
  }),

  function (options) {
    const {
      app: { service },
    } = this;

    return service.look(options);
  },
);

router.getFlow('/look',
  function () {
    const {
      app: { service },
    } = this;

    return service.list();
  },
);

router.getFlow('/look/:id',
  type({
    id: { path: 'params', required: true },
  }),

  function ({ id }) {
    const {
      app: { service },
    } = this;

    return service.get(id);
  },
);

router.deleteFlow('/look/:id',
  type({
    id: { path: 'params', required: true },
  }),

  function ({ id }) {
    const {
      app: { service },
    } = this;

    return service.del(id);
  },
);

module.exports = router;

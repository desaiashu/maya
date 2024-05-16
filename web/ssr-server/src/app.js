'use strict';

const fastify = require('fastify');

function build(opts = {}) {
  const app = fastify(opts);

  app.get('/:slug', async (request, reply) => {
    return { params: request.params };
  });

  return app;
}

module.exports = build;

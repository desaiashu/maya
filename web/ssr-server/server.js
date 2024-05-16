'use strict';

const envToLogger =
  require('./envToLogger')[process.env.NODE_ENV || 'development'];
const server = require('./app')({ logger: envToLogger });

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});

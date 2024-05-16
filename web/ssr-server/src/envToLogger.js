// https://fastify.dev/docs/latest/Reference/Logging/

const devConfig = {
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
  },
};

const prodConfig = true;
const testConfig = devConfig;

module.exports = {
  development: devConfig,
  production: prodConfig,
  test: testConfig,
};

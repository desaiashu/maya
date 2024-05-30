const buildFastify = require('./app'); // Adjusted the import to point directly to the app builder

describe('GET /:slug', () => {
  let fastify;

  beforeAll(async () => {
    fastify = buildFastify({ logger: false });
    await fastify.ready();
  });

  afterAll(() => {
    if (fastify) {
      fastify.close();
    }
  });

  test('It should respond with the expected slug', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/test-slug',
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(JSON.parse(response.payload)).toEqual({
      params: { slug: 'test-slug' },
    });
  });
});

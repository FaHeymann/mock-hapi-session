const Lab = require('@hapi/lab');
const { expect, fail } = require('@hapi/code');
const Hapi = require('@hapi/hapi');
const yar = require('@hapi/yar');
const plugin = require('../..');

const lab = Lab.script();
const { describe, test: it } = lab;

module.exports = { lab };

const yarOptions = {
  name: 'someKey',
  maxCookieSize: 0,
  storeBlank: false,
  cookieOptions: {
    password: '123456789123456789123456789123456789',
    isSecure: false,
    isHttpOnly: true,
    isSameSite: false,
    ttl: 24 * 3600 * 1000,
  },
};

const createServer = async (pluginOptions) => {
  const server = new Hapi.Server({
    port: 80000,
  });

  await server.register({
    plugin,
    options: pluginOptions,
  });

  await server.register({
    plugin: yar,
    options: yarOptions,
  });

  server.route({
    method: 'GET',
    path: '/example',
    handler: (request, h) => {
      const test = request.yar.get('someKey');
      return h.response(test);
    },
  });

  await server.initialize();

  return server;
};

describe('mock-hapi-session', () => {
  it('should throw a joi error if no cookie key is given', async () => {
    try {
      await createServer({});
      fail('should have thrown an error');
    } catch (err) {
      expect(err.isJoi).to.be.true();
    }
  });

  it('should set the provided data to yar', async () => {
    const server = await createServer({ cookieKey: 'someKey' });

    const response = await server.inject({
      method: 'GET',
      url: '/example',
      headers: { cookie: await server.plugins.mockSession.mock({ someKey: 'someValue' }) },
    });

    expect(response.result).to.equal({ someKey: 'someValue' });
  });

  it('should work with another route', async () => {
    const server = await createServer({ cookieKey: 'someKey', path: '/another-route' });

    const response = await server.inject({
      method: 'GET',
      url: '/example',
      headers: { cookie: await server.plugins.mockSession.mock({ someKey: 'someValue' }) },
    });

    expect(response.result).to.equal({ someKey: 'someValue' });
  });
});

import Lab from 'lab';
import { expect, fail } from 'code';
import Hapi from 'hapi';
import yar from 'yar';
import plugin from '../../src/mock-hapi-session';

export const lab = Lab.script();
const { describe, test: it } = lab;

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
  }
};

const createServer = async (pluginOptions) => {
  const server = new Hapi.Server();
  server.connection({
    port: 80000,
  });

  await server.register([{
    register: plugin,
    options: pluginOptions,
  }, {
    register: yar,
    options: yarOptions,
  }]);

  server.route({
    method: 'GET',
    path: '/example',
    handler: (request, reply) => {
      const test = request.yar.get('someKey');
      reply(test);
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

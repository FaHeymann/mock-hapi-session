import Joi from 'joi';
import Package from '../package.json';

const schema = Joi.object().keys({
  cookieKey: Joi.string().required(),
  path: Joi.string().default('/mock-session'),
});

export const register = (server, options, next) => {
  const { error, value: config } = schema.validate(options);

  if (error) {
    throw error;
  }

  server.route({
    method: 'POST',
    path: config.path,
    handler: (request, reply) => {
      request.yar.set(config.cookieKey, request.payload);
      reply();
    },
  });

  server.expose({
    mock: async (sessionData) => {
      const response = await server.inject({
        method: 'POST',
        url: config.path,
        payload: sessionData,
      });

      return config.cookieKey + '=' + response.headers['set-cookie'][0]
          .match(/(?:[^\x00-\x20()<>@,;:\\"/[\]?={}\x7F]+)\s*=\s*(?:([^\x00-\x20",;\\\x7F]*))/)[1];
    },
  });

  next();
};

register.attributes = {
  name: 'mockSession',
  version: Package.version,
};

export default { register };

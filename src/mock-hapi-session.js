const Joi = require('joi');
const Package = require('../package.json');

const schema = Joi.object().keys({
  cookieKey: Joi.string().required(),
  path: Joi.string().default('/mock-session'),
});

const plugin = {
  name: 'mockSession',
  version: Package.version,
  register: async (server, options) => {
    const { error, value: config } = schema.validate(options);

    if (error) {
      throw error;
    }

    server.route({
      method: 'POST',
      path: config.path,
      handler: async (request, h) => {
        request.yar.set(config.cookieKey, request.payload);
        return h.response();
      },
    });

    server.expose({
      mock: async (sessionData) => {
        const response = await server.inject({
          method: 'POST',
          url: config.path,
          payload: sessionData,
        });

        return `${config.cookieKey}=${response.headers['set-cookie'][0]}`
          .match(/(?:[^\x00-\x20()<>@,;:\\"/[\]?={}\x7F]+)\s*=\s*(?:([^\x00-\x20",;\\\x7F]*))/)[1];
      },
    });
  },
};

module.exports = { plugin };

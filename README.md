# mock-hapi-session

```bash
npm install --save-dev mock-hapi-session
```

This plugin allows you to mock [hapi](https://github.com/hapijs/hapi) [yar sessions](https://github.com/hapijs/yar) for testing.

## Usage

After you set up your hapi server for testing, register the plugin:

```javascript
import mockSession from 'mock-hapi-session';

server.register({
  plugin: mockSession,
  options: { cookieKey: 'myCookieKey' },
});
```
where coookieKey is the name of the cookie you want to mock (the name option of yar).

You can now use the plugin to set a cookie and access it in following request by providing a `cookie` header.

```javascript
server.plugins.mockSession.mock(value);
```

injects a cookie into yar and returns a promise that resolves to the cookie header value to get access.

```javascript
await server.inject({
  method: 'GET',
  url: '/my-route-to-test-that-uses-yar',
  headers: { cookie: await server.plugins.mockSession.mock({ some: 'mockedSession' }) },
});
```

## Changelog

- v1 was tested with Hapi v16 and node v6
- v2 requires Hapi v20+ and node v16+

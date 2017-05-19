# mock-hapi-session

```bash
npm install --save-dev mock-hapi-session
```
```bash
yarn add --dev mock-hapi-session
```

This plugin allows you to mock [hapi](https://github.com/hapijs/hapi) [yar sessions](https://github.com/hapijs/yar) for testing.

## Usage

After you set up your hapi server for testing, register the plugin:

```javascript
import mockSession from 'mock-hapi-session';

server.register({
  register: mockSession,
  options: { cookieKey: 'myCookieKey' },
});
```
where coookieKey is the name of the cookie you want to mock (the name option of yar).

You can now use the plugin to set a cookie and access it in following request by providing a `cookie` header.

```javascript
server.plugins.mockSession.mock(value);
```

injects a cookie into yar and returns a promise that resolves to the cookie header value to get access.

Using promises:

```javascript
server.plugins.mockSession.mock({ some: 'mockedSession' })
  .then(cookieHeader => server.inject({
    method: 'GET',
    url: '/my-route-to-test-that-uses-yar',
    headers: { cookie: cookieHeader },
  }))
  .then(/* ... */);
```

Using async/await:

```javascript
await server.inject({
  method: 'GET',
  url: '/my-route-to-test-that-uses-yar',
  headers: { cookie: await server.plugins.mockSession.mock({ some: 'mockedSession' }) },
});
```

const got = require('got').default;
const { URL, URLSearchParams, format } = require('url');

(async () => {
  try {
    const test = got.extend({
      https: {
        rejectUnauthorized: false,
      },
      hooks: {
        beforeRequest: [
          (options) => {
            let _body;
            const { json, body, form } = options;
            if (json) _body = JSON.stringify(json);
            if (body) _body = body;
            if (form) _body = new URLSearchParams(form).toString();
            const _method = options.method;
            const _headers = options.headers;
            const _url = format(options.url);
            options.method = 'POST';
            options.url = new URL('https://httpbin.org/anything');
            options.body = undefined;
            options.form = undefined;
            options.json = {
              url: _url,
              body: _body,
              headers: _headers,
              method: _method,
            };
          },
        ],
      },
    });

    const { body } = await test('https://example.com', {
      headers: {
        'user-agent': 'test',
      },
    });
    console.log(body);
  } catch (e) {
    console.error((e.response && e.response.request.options) || e);
  }
})();

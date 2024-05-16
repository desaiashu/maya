const fastify = require('fastify');
const { renderToString } = require('react-dom/server');
const React = require('react');
const MayaWeb = require('../../maya.web.tsx');
const appName = require('../../../app.json').name;
require('%/fonts/fonts.css');

// Disable console.log in production
if (process.env.NODE_ENV === 'prod') {
  console.log = function () {};
}

function build(opts = {}) {
  const app = fastify(opts);

  app.get('/:slug', async (request, reply) => {
    const content = renderToString(React.createElement(MayaWeb));
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR with React</title>
        <meta
          name="description"
          content="Maya is an app to help you learn and discover new perspectives."
        />
        <meta
          property="og:title"
          content="${appName}"
        />
        <meta
          property="og:description"
          content="Maya is an app to help you learn and discover new perspectives."
        />
        <meta
          property="og:image"
          content="https://seekmaya.com/icon-512-maskable.png"
        />
      </head>
      <body>
        <div id="root">${content}</div>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `;
    return html;
  });

  return app;
}

module.exports = build;

const https = require('https');
const querystring = require('querystring');

function fetchPageData(slug) {
  const queryString = querystring.stringify({ slug });
  return new Promise((resolve, reject) => {
    https.get(`https://prod.seekmaya.com/og?${queryString}`, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
      res.on('error', reject);
    });
  });
}

exports.handler = async (event, context) => {
  let pageData = {
    title: 'Maya',
    description:
      'Maya is an app to help you learn and discover new perspectives.',
    image: 'https://seekmaya.com/icon-512-maskable.png',
  };
  try {
    const slug = event.path.split('/').pop();
    let fetchedData = await fetchPageData(slug);
    for (let key in fetchedData) {
      fetchedData[key] = fetchedData[key].replace(/"/g, '&quot;');
    }
    pageData = { ...pageData, ...fetchedData };
  } catch (err) {
    console.error(err);
  }

  const fullHtml = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <title>${pageData.title}</title>
        <meta name="description" content="${pageData.description}" />
        <meta property="og:title" content="${pageData.title}" />
        <meta property="og:description" content="${pageData.description}" />
        <meta
          property="og:image"
          content="${pageData.image}"
        />
      </head>
      <body>
        <div id="maya-root"></div>
        <script src="/bundle.web.js"></script>
      </body>
    </html>
  `;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: fullHtml,
  };
};

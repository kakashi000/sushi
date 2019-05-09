const got = require('got');

async function kitsu(type, query) {
  const options = {
    baseUrl: 'https://kitsu.io/api/edge/',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    json: true,
    query: {
      'filter[text]': query,
    },
  };

  const response = await got(type, options);
  return response;
}

module.exports = kitsu;

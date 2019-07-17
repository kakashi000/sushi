const { google } = require('googleapis');
const config = require('../config/config.json');

const search = google.customsearch('v1');

const generateImageLinks = async (query) => {
  const options = {
    cx: config.imgID,
    key: config.imgKey,
    q: query,
    searchType: 'image',
  };

  const response = await search.cse.list(options);

  const links = response.data.items.map(item => item.link);

  return links;
};

module.exports = generateImageLinks;

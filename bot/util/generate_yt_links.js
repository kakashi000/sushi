const { google } = require('googleapis');
const config = require('../config/config.json');
const bot = require('../bot.js');

const youtube = google.youtube({
  version: 'v3',
  auth: config.youtubeKey,
});

const generateLinks = async (msg, query) => {
  const params = {
    part: 'snippet',
    q: query,
    type: 'video',
  };

  const response = await youtube.search.list(params);
  const links = [];
  const hasAddReactionsPermission = msg.channel.permissionsOf(bot.user.id).has('addReactions');

  response.data.items.forEach((item) => {
    let content = `https://youtube.com/watch?v=${item.id.videoId}`;

    if (hasAddReactionsPermission) {
      content += `\n${msg.author.username} can use the reaction buttons below to switch pages!`;
    }

    links.push(content);
  });

  return links;
};

module.exports = generateLinks;

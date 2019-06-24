const { google } = require('googleapis');
const config = require('../config/config.json');
const pagination = require('../common/pagination.js');
const bot = require('../bot.js');

const command = {};

command.name = 'youtube';

async function generateLinks(msg, query) {
  const links = [];
  const hasAddReactionsPermission = msg.channel.permissionsOf(bot.user.id).has('addReactions');

  const youtube = google.youtube({
    version: 'v3',
    auth: config.youtubeKey,
  });

  const params = {
    part: 'snippet',
    q: query,
    type: 'video',
  };

  const response = await youtube.search.list(params);

  response.data.items.forEach((item) => {
    let content = `https://youtube.com/watch?v=${item.id.videoId}`;
    if (hasAddReactionsPermission) {
      content += `\n${msg.author.username} can use the reaction buttons below to switch pages!`;
    }
    links.push(content);
  });

  return links;
}

command.action = async (msg, args) => {
  const links = await generateLinks(msg, args.join(' '));
  pagination.saveData(
    msg.id,
    links,
    msg.author.id,
    command.options.reactionButtonTimeout,
  );
  return msg.channel.createMessage(links[0]);
};

command.options = {
  aliases: ['yt'],
  argsRequired: true,
  cooldown: 3000,
  description: 'Searches for a video on YouTube!',
  usage: 'yt we are number one',
  reactionButtonTimeout: 120000,
};

module.exports = pagination.addReactionButtons(command, command.options.reactionButtonTimeout);

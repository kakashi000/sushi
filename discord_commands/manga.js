/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const bot = require('../bot.js');
const kitsu = require('../common/kitsu_search.js');
const pagination = require('../common/pagination.js');
const config = require('../config/config.json');

async function generateEmbeds(msg, args) {
  const response = await kitsu('manga', args.join(' '));

  if (!response.body.data[0]) {
    return 'Manga not found~';
  }

  const embeds = response.body.data.map((manga, index, data) => ({
    embed: {
      title: 'Kitsu Manga Search',
      description: `Page ${(index + 1)} out of ${(data.length)}`,
      color: config.color,
      author: {
        icon_url: bot.user.avatarURL,
      },
      fields: [
        {
          name: 'Title',
          value: manga.attributes.canonicalTitle,
        },
        {
          name: 'Type',
          value: manga.attributes.subtype,
        },
        {
          name: 'Synopsis',
          value: (manga.attributes.synopsis.length < 700)
            ? manga.attributes.synopsis : `${manga.attributes.synopsis.substr(0, 700)}...`,
        },
      ],
      thumbnail: {
        url: manga.attributes.posterImage.small,
      },
      timestamp: new Date(),
      footer: {
        icon_url: msg.author.avatarURL,
        text: `${msg.author.username} can tap the reaction buttons below to switch pages!`,
      },
    },
  }));

  return embeds;
}

const command = {};

command.name = 'manga';

command.action = async (msg, args) => {
  const mangaEmbeds = await generateEmbeds(msg, args);
  const data = pagination.saveData(
    msg.id,
    mangaEmbeds,
    msg.author.id,
    command.options.reactionButtonTimeout,
  );
  return msg.channel.createMessage(data[0]);
};

command.options = {
  aliases: ['m'],
  cooldown: 3000,
  description: 'Search for an manga on Kitsu.io!',
  reactionButtonTimeout: 120000,
  usage: 'manga yuru yuri',
};

module.exports = pagination.addReactionButtons(command);

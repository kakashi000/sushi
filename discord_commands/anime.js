/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const got = require('got');
const bot = require('../bot.js');
const pagination = require('../common/pagination.js');
const config = require('../config/config.json');

async function generateEmbeds(msg, args) {
  const options = {
    baseUrl: 'https://kitsu.io/api/edge/',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    json: true,
    query: {
      'filter[text]': args.join(''),
    },
  };

  const response = await got('anime', options);

  if (!response.body.data[0]) {
    return 'Anime not found~';
  }

  const embeds = response.body.data.map((anime, index, data) => ({
    embed: {
      title: 'Kitsu Anime Search',
      description: `Page ${(index + 1)} out of ${(data.length)}`,
      color: config.color,
      author: {
        icon_url: bot.user.avatarURL,
      },
      fields: [
        {
          name: 'Title',
          value: anime.attributes.canonicalTitle,
        },
        {
          name: 'Type',
          value: anime.attributes.subtype,
        },
        {
          name: 'Synopsis',
          value: (anime.attributes.synopsis.length < 700)
            ? anime.attributes.synopsis : `${anime.attributes.synopsis.substr(0, 700)}...`,
        },
      ],
      thumbnail: {
        url: anime.attributes.posterImage.small,
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

command.name = 'anime';

command.action = async (msg, args) => {
  const animeEmbeds = await generateEmbeds(msg, args);
  const data = pagination.saveData(
    msg.id,
    animeEmbeds,
    msg.author.id,
    command.options.reactionButtonTimeout,
  );
  return msg.channel.createMessage(data[0]);
};

command.options = {
  aliases: ['a'],
  cooldown: 3000,
  description: 'Search for an anime on Kitsu.io!',
  reactionButtonTimeout: 120000,
  usage: 'anime yuru yuri',
};

module.exports = pagination.addReactionButtons(command);

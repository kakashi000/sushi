/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const got = require('got');
const bot = require('../bot.js');
const config = require('../config/config.json');

bot.persistence = {};

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
  bot.persistence[msg.id] = {
    embeds: animeEmbeds,
    authorID: msg.author.id,
    page: 0,
    timestamp: Math.floor(Date.now() / 1000),
  };
  setTimeout(() => delete bot.persistence[msg.id], command.options.reactionButtonTimeout);
  return msg.channel.createMessage(animeEmbeds[0]);
};

command.options = {
  aliases: ['a'],
  cooldown: 3000,
  description: 'Search for an anime on Kitsu.io!',
  hooks: {
    // reaction buttons take the bot's command message as the parameter
    postCommand: (msg, args, res) => {
      bot.persistence[res.id] = bot.persistence[msg.id];
    },
  },
  reactionButtonTimeout: 120000,
  usage: 'anime yuru yuri',
};

command.options.reactionButtons = [
  {
    emoji: '⬅',
    type: 'edit',
    response: (msg, args, userID) => {
      const data = bot.persistence[msg.id];
      if (data.authorID !== userID) {
        return;
      }
      if (data.page === 0) {
        return;
      }
      bot.persistence[msg.id].page -= 1;
      return data.embeds[(data.page)];
    },
  },
  {
    emoji: '➡',
    type: 'edit',
    response: (msg, args, userID) => {
      const data = bot.persistence[msg.id];
      if (data.authorID !== userID) {
        return;
      }
      if (data.page === (data.embeds.length - 1)) {
        return;
      }
      bot.persistence[msg.id].page += 1;
      return data.embeds[(data.page)];
    },
  },
];

module.exports = command;

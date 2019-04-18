/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const got = require('got');
const bot = require('../bot.js');
const config = require('../config/config.json');

bot.persistence = {};

async function generateEmbeds(args) {
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

  const embeds = response.body.data.map(anime => ({
    embed: {
      title: 'Kitsu Anime Search',
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
        icon_url: bot.user.avatarURL,
        text: 'powered by Kitsu.io',
      },
    },
  }));

  return embeds;
}

const command = {};

command.name = 'anime';

command.action = async (msg, args) => {
  const animeEmbeds = await generateEmbeds(args);
  bot.persistence[msg.id] = animeEmbeds;
  return msg.channel.createMessage(animeEmbeds[0]);
};

command.options = {
  aliases: ['a'],
  cooldown: 3000,
  description: 'Search for an anime on Kitsu.io!',
  hooks: {
    postCommand: async (msg, args, res) => {
      bot.persistence[res.id] = bot.persistence[msg.id];
    },
  },
  usage: 'anime yuru yuri',
};

command.options.reactionButtons = [
  {
    emoji: '1⃣',
    type: 'edit',
    response: async msg => bot.persistence[msg.id][0],
  },
  {
    emoji: '2⃣',
    type: 'edit',
    response: async msg => bot.persistence[msg.id][1],
  },
  {
    emoji: '3⃣',
    type: 'edit',
    response: async msg => bot.persistence[msg.id][2],
  },
];

module.exports = command;

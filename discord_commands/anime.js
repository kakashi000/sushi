/* eslint-disable prefer-destructuring */
const got = require('got');
const bot = require('../bot.js');
const config = require('../config/config.json');

const command = {};

command.name = 'anime';

command.action = async (msg, args) => {
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
    return msg.channel.createMessage('Anime not found~');
  }

  const anime = {};
  anime.title = response.body.data[0].attributes.canonicalTitle;
  // cut off synopsis if it's too long
  const synopsis = response.body.data[0].attributes.synopsis;
  anime.synopsis = (synopsis.length < 700) ? synopsis : `${synopsis.substr(0, 700)}...`;
  anime.thumbnail = response.body.data[0].attributes.posterImage.small;
  anime.type = response.body.data[0].attributes.subtype;

  const animeEmbed = {
    embed: {
      title: 'Kitsu Anime Search',
      color: config.color,
      author: {
        icon_url: bot.user.avatarURL,
      },
      fields: [
        {
          name: 'Title',
          value: anime.title,
        },
        {
          name: 'Type',
          value: anime.type,
        },
        {
          name: 'Synopsis',
          value: anime.synopsis,
        },
      ],
      thumbnail: {
        url: anime.thumbnail,
      },
      timestamp: new Date(),
      footer: {
        icon_url: bot.user.avatarURL,
        text: 'powered by Kitsu.io',
      },
    },
  };

  return msg.channel.createMessage(animeEmbed);
};

command.options = {
  aliases: ['a'],
  cooldown: 3000,
  description: 'Search for an anime on Kitsu.io!',
  usage: 'anime yuru yuri',
};

module.exports = command;

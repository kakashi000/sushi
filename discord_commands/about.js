const bot = require('../bot.js');
const config = require('../config/config.json');

const command = {};

command.action = (msg) => {
  const about = {
    embed: {
      title: 'About sushi',
      description: 'An anime-themed discord bot.',
      color: config.color,
      thumbnail: {
        url: bot.user.avatarURL,
      },
      fields: [
        {
          name: 'Developer',
          value: '**kakashi**#0399',
        },
        {
          name: 'Library',
          value: '**Eris** 0.9.0',
        },
        {
          name: 'Git Repository',
          value: 'https://github.com/kakashi000/sushi',
        },
      ],
    },
  };

  return msg.channel.createMessage(about);
};

command.options = {
  aliases: ['about-bot'],
  cooldown: 1000,
  description: 'Diplay the about message!',
  errorMessage: 'Something went wrong with that command.',
  usage: 'about',
};

module.exports = command;

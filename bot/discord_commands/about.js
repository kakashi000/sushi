const bot = require('../bot.js');
const config = require('../config/config.json');

const command = {
  name: 'about',

  action: (msg) => {
    const aboutEmbed = {
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
            inline: true,
          },
          {
            name: 'Library',
            value: '**Eris** 0.9.0',
            inline: true,
          },
          {
            name: 'Git Repository',
            value: 'https://github.com/kakashi000/sushi',
          },
          {
            name: 'Support Server',
            value: 'https://discord.gg/XbVahqe',
          },
          {
            name: 'Bot Invite Link',
            value: 'https://discordapp.com/oauth2/authorize?client_id=561092137601597440&scope=bot',
          },
        ],
      },
    };

    return msg.channel.createMessage(aboutEmbed);
  },

  options: {
    aliases: ['bot'],
    cooldown: 1000,
    description: 'Diplay the about message!',
    usage: 'about',
  },
};

module.exports = command;

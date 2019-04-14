const bot = require('../bot.js');
const config = require('../config/config.json');
const storage = require('../config/storage.js');

const command = {};

command.name = 'help';

command.action = async (msg, args) => {
  const guild = await storage.getItem(msg.channel.guild.id, {});
  if (!args[0]) {
    const help = {
      embed: {
        description: '',
        color: config.color,
        author: {
          name: bot.user.username,
          icon_url: bot.user.avatarURL,
        },
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: 'made using the Eris library',
        },
        fields: [],
      },
    };
    console.log(bot.commands);
    // add a field for each command
    Object.keys(bot.commands).forEach((key) => {
      help.embed.fields.push({
        name: key,
        value: `${bot.commands[key].description}\n\`${guild.prefix[0]}${bot.commands[key].usage}\``,
      });
    });
    return msg.channel.createMessage(help);
  }

  let commandName = args[0];

  // check if there's a command for the given name/alias
  if (!bot.commandAliases[commandName] && !bot.commands[commandName]) {
    return msg.channel.createMessage('Command not found~');
  }

  if (!bot.commandAliases[commandName]) {
    Object.keys(bot.commandAliases).forEach((key) => {
      if (commandName === bot.commandAliases[key]) {
        commandName = key;
      }
    });
  }

  const commandHelp = {
    embed: {
      color: config.color,
      title: bot.commands[bot.commandAliases[commandName]].name,
      description: bot.commands[bot.commandAliases[commandName]].description,
      fields: [
        {
          name: 'Usage',
          value: `\`${guild.prefix[0]}${bot.commands[bot.commandAliases[commandName]].usage}\``,
        },
      ],
    },
  };

  return msg.channel.createMessage(commandHelp);
};

command.options = {
  aliases: ['h', 'commands'],
  description: 'Diplay the help message, or get more information on a command!',
  errorMessage: 'Something went wrong with that command.',
  usage: 'help translate',
};

module.exports = command;

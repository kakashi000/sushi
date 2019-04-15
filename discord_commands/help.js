const bot = require('../bot.js');
const config = require('../config/config.json');
const storage = require('../config/storage.js');

const command = {};

command.name = 'help';

command.action = async (msg, args) => {
  let guild = {};
  if (msg.channel.guild) {
    guild = await storage.getItem(msg.channel.guild.id, {});
  } else {
    guild = { prefix: bot.commandOptions.prefix[0] };
  }
  if (!args[0]) {
    // generate help embed
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

    // add a field for each command
    Object.keys(bot.commands).forEach((key) => {
      help.embed.fields.push({
        name: key,
        value: `${bot.commands[key].description}\n\`${guild.prefix[0]}${bot.commands[key].usage}\``,
      });
    });
    return msg.channel.createMessage(help);
  }

  const commandName = args[0];

  // check if there's a command for the given name/alias
  if (!bot.commandAliases[commandName] && !bot.commands[commandName]) {
    return msg.channel.createMessage('Command not found~');
  }

  // if commandName is not an alias, replace it with the corresponding alias
  /* if (!bot.commandAliases[commandName]) {
    Object.keys(bot.commandAliases).forEach((key) => {
      if (commandName === bot.commandAliases[key]) {
        commandName = key;
      }
    });
  } */

  // get command data using the alias
  const commandHelp = {
    embed: {
      color: config.color,
      title: bot.commands[commandName].name,
      description: bot.commands[commandName].description,
      fields: [
        {
          name: 'Usage',
          value: `\`${guild.prefix[0]}${bot.commands[commandName].usage}\``,
        },
      ],
    },
  };

  return msg.channel.createMessage(commandHelp);
};

command.options = {
  aliases: ['h', 'commands'],
  cooldown: 1000,
  description: 'Diplay the help message, or get more information on a command!',
  errorMessage: 'Something went wrong with that command.',
  usage: 'help translate',
};

module.exports = command;

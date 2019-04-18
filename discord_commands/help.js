/* eslint-disable prefer-destructuring */
const bot = require('../bot.js');
const config = require('../config/config.json');
const storage = require('../config/storage.js');

const command = {};

command.name = 'help';

command.action = async (msg, args) => {
  let prefix;
  if (msg.channel.guild) {
    const guild = await storage.getItem(msg.channel.guild.id, {});
    prefix = guild.prefix[0];
  } else {
    prefix = bot.commandOptions.prefix[0];
  }

  if (!args[0]) {
    // generate help embed
    const helpEmbed = {
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
      helpEmbed.embed.fields.push({
        name: key,
        value: `${bot.commands[key].description}\n\`${prefix}${bot.commands[key].usage}\``,
      });
    });
    return msg.channel.createMessage(helpEmbed);
  }

  let commandName = args[0];

  // check if there's a command for the given name/alias
  if (!bot.commandAliases[commandName] && !bot.commands[commandName]) {
    return msg.channel.createMessage(`Command not found. Type ${prefix}help to see my commands~`);
  }

  // if commandName is an alias, replace it with the corresponding command name
  if (bot.commandAliases[commandName]) {
    commandName = bot.commandAliases[commandName];
  }

  // get command data using the command name
  const commandHelpEmbed = {
    embed: {
      color: config.color,
      title: bot.commands[commandName].name,
      description: bot.commands[commandName].description,
      fields: [
        {
          name: 'Aliases',
          value: `\`${bot.commands[commandName].aliases.join('`, `')}\``,
        },
        {
          name: 'Usage',
          value: `\`${prefix}${bot.commands[commandName].usage}\``,
        },
      ],
    },
  };

  return msg.channel.createMessage(commandHelpEmbed);
};

command.options = {
  aliases: ['h', 'commands'],
  cooldown: 1000,
  description: 'Diplay the help message, or get more information on a command!',
  usage: 'help translate',
};

module.exports = command;

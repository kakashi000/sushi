/* eslint-disable prefer-destructuring */
const bot = require('../bot.js');
const config = require('../config/config.json');
const storage = require('../config/storage.js');

const command = {};

command.name = 'help';

function generateHelpEmbed(prefix) {
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
    if (bot.commands[key].hidden) {
      return;
    }

    helpEmbed.embed.fields.push({
      name: key,
      value: `${bot.commands[key].description}\n\`${prefix}${bot.commands[key].usage}\``,
    });
  });

  return helpEmbed;
}

command.action = async (msg, args) => {
  let prefix;
  if (msg.channel.guild) {
    const guild = await storage.getItem(msg.channel.guild.id, {});
    if (guild.prefix) {
      prefix = guild.prefix[0];
    } else {
      prefix = bot.commandOptions.prefix[0];
    }
  } else {
    prefix = bot.commandOptions.prefix[0];
  }

  if (!args[0]) {
    const helpEmbed = await generateHelpEmbed(prefix);
    bot.persistence[msg.id] = {
      page: 0,
      authorID: msg.author.id,
    };
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

  const botCommand = bot.commands[commandName];

  // get command data using the command name
  const commandHelpEmbed = {
    embed: {
      color: config.color,
      title: commandName,
      description: botCommand.description,
      fields: [
        {
          name: 'Aliases',
          value: `\`${botCommand.aliases.join('`, `')}\``,
        },
        {
          name: 'Usage',
          value: `\`${prefix}${botCommand.usage}\``,
        },
      ],
    },
  };

  const permissions = botCommand.requirements.permissions;

  if (permissions.length !== 0) {
    const permissionsList = [];
    Object.keys(permissions).forEach((key) => {
      permissionsList.push(key);
    });
    if (permissionsList[0]) {
      commandHelpEmbed.embed.fields.push({
        name: 'Requirements',
        value: `\`${permissionsList.join('`, `')}\``,
      });
    }
  }

  return msg.channel.createMessage(commandHelpEmbed);
};

command.options = {
  aliases: ['h', 'commands'],
  cooldown: 1000,
  description: 'Diplay the help message, or get more information on a command!',
  usage: 'help translate',
};

module.exports = command;

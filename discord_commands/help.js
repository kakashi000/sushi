const bot = require('../bot.js');
const config = require('../config/config.json');
const storage = require('../config/storage.js');
const pagination = require('../common/pagination.js');

const command = {};

command.name = 'help';

function generateHelpEmbeds(prefix, msg) {
  const helpEmbeds = [];

  const commandArray = Object.keys(bot.commands).map(
    key => bot.commands[key],
  );

  commandArray.filter((botCommand, index) => {
    if (botCommand.hidden) {
      commandArray.splice(index, 1);
    }
    return botCommand;
  });

  const pageSize = 7;
  const commandArrays = [];

  for (let i = 0; i < commandArray.length; i += pageSize) {
    commandArrays.push(commandArray.slice(i, i + pageSize));
  }

  commandArrays.forEach((arr, index) => {
    const hasAddReactionsPermission = msg.channel.permissionsOf(bot.user.id).has('addReactions');
    const currentPage = (index + 1);
    const lastPage = commandArrays.length;

    const helpEmbed = {
      embed: {
        title: 'Commands',
        description: `Page ${(currentPage)} out of ${(lastPage)}`,
        color: config.color,
        author: {
          name: bot.user.username,
          icon_url: bot.user.avatarURL,
        },
        timestamp: new Date(),
        footer: {
          icon_url: msg.author.avatarURL,
          text: hasAddReactionsPermission
            ? `${msg.author.username} can tap the reaction buttons below to switch pages!`
            : 'Type help [page] to view other commands!',
        },
        fields: [],
      },
    };

    arr.forEach((botCommand) => {
      helpEmbed.embed.fields.push({
        name: botCommand.label,
        value: `${botCommand.description}\n\`${prefix}${botCommand.usage}\``,
      });
    });

    helpEmbeds.push(helpEmbed);
  });

  return helpEmbeds;
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

  // check if the first argument is a single digit

  let pageNumber;
  if (args[0]) {
    pageNumber = (args[0].match(/^\d$/) - 1);
  }

  if (!args[0] || pageNumber) {
    const helpEmbeds = await generateHelpEmbeds(prefix, msg);
    pagination.saveData(
      msg.id,
      helpEmbeds,
      msg.author.id,
      command.options.reactionButtonTimeout,
      pageNumber,
    );

    if (helpEmbeds[pageNumber]) {
      return msg.channel.createMessage(helpEmbeds[pageNumber]);
    }

    return msg.channel.createMessage(helpEmbeds[0]);
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
  reactionButtonTimeout: 120000,
};

module.exports = pagination.addReactionButtons(command, command.options.reactionButtonTimeout);

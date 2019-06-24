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
            : 'Type help [page] to view the other pages!',
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

  let pageNumber;
  if (args[0]) {
    // regex for single digits
    pageNumber = /^\d$/.test(args[0])
      ? args[0] - 1
      : undefined;
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

    if (!args[0]) {
      return msg.channel.createMessage(helpEmbeds[0]);
    }

    if (helpEmbeds[pageNumber]) {
      return msg.channel.createMessage(helpEmbeds[pageNumber]);
    }
  }

  let commandName = args[0];

  if (!bot.commandAliases[commandName] && !bot.commands[commandName]) {
    return msg.channel.createMessage(`Command not found. Type ${prefix}help to see my commands~`);
  }

  if (bot.commandAliases[commandName]) {
    commandName = bot.commandAliases[commandName];
  }

  const botCommand = bot.commands[commandName];

  const description = botCommand.fullDescription !== 'No full description'
    ? botCommand.fullDescription.replace(/\{prefix\}/g, prefix)
    : botCommand.description;

  const commandHelpEmbed = {
    embed: {
      color: config.color,
      title: commandName,
      description,
      fields: [
        {
          name: 'Aliases',
          value: `\`${botCommand.aliases.join('`, `')}\``,
          inline: true,
        },
        {
          name: 'Example Usage',
          value: `\`${prefix}${botCommand.usage}\``,
          inline: true,
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
  fullDescription: `
Displays the help message. \`{prefix}help\` sends the list of commands.

You can also type \`{prefix}help 2\` to start at the second page and so on. This is especially useful for cases when the bot does not have the permissions to add reaction buttons.

Type \`{prefix}help command\` to view detailed information on specific commands.
  `,
  usage: 'help translate',
  reactionButtonTimeout: 120000,
};

module.exports = pagination.addReactionButtons(command, command.options.reactionButtonTimeout);

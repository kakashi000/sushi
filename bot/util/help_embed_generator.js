const bot = require('../bot.js');
const config = require('../config/config.json');

const helpEmbedGenerator = {
  generateHelpEmbeds: (prefix, msg) => {
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

    const helpEmbeds = [];

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
  },

  generateCommandEmbed: (msg, args, prefix) => {
    let commandName = args[0];

    if (!bot.commandAliases[commandName] && !bot.commands[commandName]) {
      return;
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

    return commandHelpEmbed;
  },
};

module.exports = helpEmbedGenerator;

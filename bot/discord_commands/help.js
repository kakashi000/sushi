const { generateHelpEmbeds, generateCommandEmbed } = require('../util/help_embed_generator.js');
const { saveData, addReactionButtons } = require('../util/pagination_manager.js');
const { getPrefix } = require('../util/prefix_manager.js');

const command = {
  name: 'help',

  action: async (msg, args) => {
    const prefix = await getPrefix(msg.channel.guild.id);

    let pageNumber;

    if (args[0]) {
      // regex for single digits
      pageNumber = /^\d$/.test(args[0])
        ? args[0] - 1
        : undefined;
    }

    if (!args[0] || pageNumber) {
      const helpEmbeds = await generateHelpEmbeds(prefix, msg);

      saveData(
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

    const commandHelpEmbed = generateCommandEmbed(msg, args, prefix);

    if (!commandHelpEmbed) {
      return msg.channel.createMessage(`Command \`${args[0]}\` not found. Type \`${prefix}help\` to see my commands!`);
    }

    return msg.channel.createMessage(commandHelpEmbed);
  },

  options: {
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
  },
};

module.exports = addReactionButtons(command, command.options.reactionButtonTimeout);

const { saveData, addReactionButtons } = require('../util/pagination_manager.js');
const { generateEmbeds } = require('../util/kitsu_embed_generator.js');

const command = {
  name: 'manga',

  action: async (msg, args) => {
    const embeds = await generateEmbeds('Manga', msg, args);

    if (!embeds) {
      return msg.channel.createMessage('Manga not found~');
    }

    saveData(
      msg.id,
      embeds,
      msg.author.id,
      command.options.reactionButtonTimeout,
    );

    return msg.channel.createMessage(embeds[0]);
  },

  options: {
    aliases: ['m', 'mango'],
    argsRequired: true,
    cooldown: 3000,
    description: 'Search for a manga on Kitsu.io!',
    reactionButtonTimeout: 120000,
    usage: 'manga berserk',
  },
};

module.exports = addReactionButtons(command, command.options.reactionButtonTimeout);

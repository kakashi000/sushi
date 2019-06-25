const { saveData, addReactionButtons } = require('../common/pagination.js');
const { generateEmbeds } = require('../common/kitsu_embed_generator.js');

const command = {};

command.name = 'manga';

command.action = async (msg, args) => {
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
};

command.options = {
  aliases: ['m', 'mango'],
  argsRequired: true,
  cooldown: 3000,
  description: 'Search for a manga on Kitsu.io!',
  reactionButtonTimeout: 120000,
  usage: 'manga berserk',
};

module.exports = addReactionButtons(command, command.options.reactionButtonTimeout);

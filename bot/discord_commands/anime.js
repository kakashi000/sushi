const { saveData, addReactionButtons } = require('../common/pagination.js');
const { generateEmbeds } = require('../common/kitsu_embed_generator.js');

const command = {};

command.name = 'anime';

command.action = async (msg, args) => {
  const embeds = await generateEmbeds('Anime', msg, args);

  if (!embeds) {
    return msg.channel.createMessage('Anime not found~');
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
  argsRequired: true,
  aliases: ['a'],
  cooldown: 3000,
  description: 'Search for an anime on Kitsu.io!',
  reactionButtonTimeout: 120000,
  usage: 'anime yuru yuri',
};

module.exports = addReactionButtons(command, command.options.reactionButtonTimeout);

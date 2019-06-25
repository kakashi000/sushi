const { saveData, addReactionButtons } = require('../common/pagination.js');
const { generateEmbeds } = require('../common/kitsu_embed_generator.js');

const command = {};

command.name = 'character';

command.action = async (msg, args) => {
  const embeds = await generateEmbeds('Character', msg, args);

  if (!embeds) {
    return msg.channel.createMessage('Character not found~');
  }

  const data = saveData(
    msg.id,
    embeds,
    msg.author.id,
    command.options.reactionButtonTimeout,
  );

  return msg.channel.createMessage(data[0]);
};

command.options = {
  aliases: ['char'],
  argsRequired: true,
  cooldown: 3000,
  description: 'Search for an anime or manga character on Kitsu.io!',
  reactionButtonTimeout: 120000,
  usage: 'char saitama',
};

module.exports = addReactionButtons(command, command.options.reactionButtonTimeout);

const kitsu = require('../common/kitsu_search.js');
const { saveData, addReactionButtons } = require('../common/pagination.js');
const generateKitsuEmbed = require('../common/kitsu_embed_generator.js');

async function generateEmbeds(msg, args) {
  const response = await kitsu('manga', args.join(' '));

  if (!response.body.data[0]) {
    return 'Manga not found~';
  }

  const embeds = response.body.data.map((manga, index, data) => (
    generateKitsuEmbed('Manga', manga, msg, (index + 1), data.length)
  ));

  return embeds;
}

const command = {};

command.name = 'manga';

command.action = async (msg, args) => {
  const mangaEmbeds = await generateEmbeds(msg, args);
  const data = saveData(
    msg.id,
    mangaEmbeds,
    msg.author.id,
    command.options.reactionButtonTimeout,
  );
  return msg.channel.createMessage(data[0]);
};

command.options = {
  aliases: ['m', 'mango'],
  argsRequired: true,
  cooldown: 3000,
  description: 'Search for a manga on Kitsu.io!',
  reactionButtonTimeout: 120000,
  usage: 'manga berserks',
};

module.exports = addReactionButtons(command, command.options.reactionButtonTimeout);

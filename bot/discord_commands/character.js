const Kitsu = require('kitsu');
const { saveData, addReactionButtons } = require('../common/pagination.js');
const generateKitsuEmbed = require('../common/kitsu_embed_generator.js');

const api = new Kitsu();
const command = {};

async function generateEmbeds(msg, args) {
  const response = await api.get('characters', {
    filter: {
      name: args.join(' '),
    },
  });

  if (!response.data[0]) {
    return 'Character not found~';
  }

  const embeds = response.data.map((character, index, data) => (
    generateKitsuEmbed('Character', character, msg, (index + 1), data.length)
  ));

  return embeds;
}

command.action = async (msg, args) => {
  const characterEmbeds = await generateEmbeds(msg, args);
  const data = saveData(
    msg.id,
    characterEmbeds,
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

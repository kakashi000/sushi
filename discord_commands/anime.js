const kitsu = require('../common/kitsu_search.js');
const pagination = require('../common/pagination.js');
const generateKitsuEmbed = require('../common/kitsu_embed_generator.js');
const bot = require('../bot.js');

async function generateEmbeds(msg, args) {
  const response = await kitsu('anime', args.join(' '));

  if (!response.body.data[0]) {
    return 'Anime not found~';
  }

  const embeds = response.body.data.map((anime, index, data) => (
    generateKitsuEmbed('Anime', anime, msg, (index + 1), data.length, bot)
  ));

  return embeds;
}

const command = {};

command.name = 'anime';

command.action = async (msg, args) => {
  const animeEmbeds = await generateEmbeds(msg, args);
  const data = pagination.saveData(
    msg.id,
    animeEmbeds,
    msg.author.id,
    command.options.reactionButtonTimeout,
  );
  return msg.channel.createMessage(data[0]);
};

command.options = {
  aliases: ['a'],
  cooldown: 3000,
  description: 'Search for an anime on Kitsu.io!',
  reactionButtonTimeout: 120000,
  usage: 'anime yuru yuri',
};

module.exports = pagination.addReactionButtons(command);

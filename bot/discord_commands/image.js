const generateLinks = require('../util/generate_image_links.js');
const { saveData, addReactionButtons } = require('../common/pagination.js');

const command = {
  name: 'image',

  action: async (msg, args) => {
    const links = await generateLinks(args.join(' '));

    saveData(
      msg.id,
      links,
      msg.author.id,
      command.options.reactionButtonTimeout,
    );

    return msg.channel.createMessage(links[0]);
  },

  options: {
    aliases: ['img'],
    argsRequired: true,
    cooldown: 3000,
    description: 'Search for an image using Google Images!',
    usage: 'img anime girl',
    reactionButtonTimeout: 120000,
  },
};
module.exports = addReactionButtons(command, command.options.reactionButtonTimeout);

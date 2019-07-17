const generateLinks = require('../util/generate_youtube_links.js');
const { saveData, addReactionButtons } = require('../util/pagination_manager.js');

const command = {
  name: 'youtube',

  action: async (msg, args) => {
    const links = await generateLinks(msg, args.join(' '));

    saveData(
      msg.id,
      links,
      msg.author.id,
      command.options.reactionButtonTimeout,
    );

    return msg.channel.createMessage(links[0]);
  },

  options: {
    aliases: ['yt'],
    argsRequired: true,
    cooldown: 3000,
    description: 'Searches for a video on YouTube!',
    usage: 'yt we are number one',
    reactionButtonTimeout: 120000,
  },
};

module.exports = addReactionButtons(command, command.options.reactionButtonTimeout);

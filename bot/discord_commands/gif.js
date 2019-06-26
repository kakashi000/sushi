const gifSearch = require('gif-search');

const command = {
  name: 'gif',

  action: async (msg, args) => {
    const author = msg.author.username;
    const keywords = args.join(' ');
    const gifUrl = await gifSearch.random(keywords);

    return msg.channel.createMessage(`${author} searched for '${keywords}'~ ${gifUrl}`);
  },

  options: {
    aliases: ['giphy'],
    argsRequired: true,
    cooldown: 3000,
    description: 'Search for a random GIF using Giphy!',
    usage: 'gif anime cute',
  },
};

module.exports = command;

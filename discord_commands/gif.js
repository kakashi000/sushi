const gifSearch = require('gif-search');

const command = {};

command.name = 'gif';

command.action = async (msg, args) => {
  const author = msg.author.username;
  const keywords = args.join(' ');
  const gifUrl = await gifSearch.random(keywords);
  return msg.channel.createMessage(`${author} searched for '${keywords}'~ ${gifUrl}`);
};

command.options = {
  aliases: ['g', 'giphy'],
  description: 'Search for a GIF using Giphy',
  errorMessage: 'Something went wrong with that command.',
  usage: 'gif anime cute',
};

module.exports = command;

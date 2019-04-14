const got = require('got');
const config = require('./../config/config.json');

const command = {};

command.name = 'image';

command.action = async (msg, args) => {
  const author = msg.author.username;
  const keywords = args.join(' ');
  const options = {
    json: true,
    query: {
      cx: config.imgID,
      key: config.imgKey,
      q: keywords,
      searchType: 'image',
    },
  };
  const response = await got('https://www.googleapis.com/customsearch/v1', options);
  // generate random int between 0 and 9
  const imgUrl = response.body.items[(Math.floor(Math.random() * (0 - 9 + 1)) + 9)].link;
  return msg.channel.createMessage(`${author} searched for '${keywords}'~ ${imgUrl}`);
};

command.options = {
  aliases: ['img', 'image'],
  description: 'Search for an image using Google Images',
  errorMessage: 'Something went wrong with that command.',
  usage: 'img anime girl',
};

module.exports = command;

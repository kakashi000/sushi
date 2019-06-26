const got = require('got');
const config = require('./../config/config.json');

const command = {
  name: 'image',

  action: async (msg, args) => {
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
    const imgUrl = response.body.items[(Math.floor(Math.random() * (0 - 9 + 1)) + 9)].link;

    return msg.channel.createMessage(`${author} searched for '${keywords}'~ ${imgUrl}`);
  },

  options: {
    aliases: ['img'],
    argsRequired: true,
    cooldown: 3000,
    description: 'Search for an image using Google Images!',
    usage: 'img anime girl',
  },
};
module.exports = command;

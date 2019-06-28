const config = require('../config/config.json');

const command = {
  name: 'say',

  action: (msg, args) => {
    const authorIsBotOwner = config.botOwnerIDs.includes(msg.author.id);

    if (authorIsBotOwner) {
      return msg.channel.createMessage(args.join(' '));
    }

    return msg.channel.createMessage(
      `:speech_balloon: ${msg.author.username}: ${args.join(' ')}`,
    );
  },

  options: {
    aliases: ['s', 'echo'],
    argsRequired: true,
    cooldown: 1000,
    description: 'Make the bot say something!',
    deleteCommand: true,
    usage: 'say hi',
  },
};

module.exports = command;

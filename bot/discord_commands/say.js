const command = {
  name: 'say',

  action: async (msg, args) => msg.channel.createMessage(args.join(' ')),

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

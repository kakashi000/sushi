const command = {};

command.name = 'say';

command.action = async (msg, args) => msg.channel.createMessage(args.join(' '));

command.options = {
  aliases: ['s', 'echo'],
  argsRequired: true,
  cooldown: 1000,
  description: 'Make the bot say something!',
  // delete the user command message
  deleteCommand: true,
  usage: 'say hi',
};

module.exports = command;

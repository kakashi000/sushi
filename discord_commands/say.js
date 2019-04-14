const bot = require('../bot.js');

const command = {};

command.name = 'say';

command.action = async (msg, args) => {
  bot.deleteMessage(msg.channel.id, msg.id);
  return msg.channel.createMessage(args.join(' '));
};

command.options = {
  aliases: ['s', 'echo'],
  description: 'Make the bot say something!',
  errorMessage: 'Something went wrong with that command.',
  usage: 'say hi',
};

module.exports = command;

const bot = require('../bot.js');

const command = {};

command.name = 'say';

command.action = async (msg, args) => {
  // delete the message
  bot.deleteMessage(msg.channel.id, msg.id);
  return msg.channel.createMessage(args.join(' '));
};

command.options = {
  aliases: ['s', 'echo'],
  cooldown: 1000,
  description: 'Make the bot say something!',
  usage: 'say hi',
};

module.exports = command;

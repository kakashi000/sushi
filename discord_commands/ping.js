const command = {};

command.name = 'ping';

command.action = msg => msg.channel.createMessage('pong!');

command.options = {
  aliases: ['pong'],
  cooldown: 1000,
  description: 'Respond with "pong!"',
  usage: 'ping',
};

module.exports = command;

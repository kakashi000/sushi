const command = {};

command.name = 'ping';

command.action = msg => msg.channel.createMessage('pong!');

command.options = {
  aliases: ['p', 'pong'],
  description: 'Respond with "pong!"',
  errorMessage: 'Something went wrong with that command.',
  usage: 'ping',
};

module.exports = command;

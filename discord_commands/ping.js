const command = {};

command.name = 'ping';

command.action = msg => msg.channel.createMessage('pong!');

command.options = {
  aliases: ['p', 'pong'],
  description: 'Respond with "pong!"',
  fullDescription: 'Say ;ping to get a "pong!',
  errorMessage: 'Something went wrong with that command.',
};

module.exports = command;

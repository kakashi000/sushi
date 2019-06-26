const command = {
  name: 'ping',

  action: msg => msg.channel.createMessage('pong!'),

  options: {
    aliases: ['pong'],
    cooldown: 1000,
    description: 'Respond with "pong!"',
    usage: 'ping',
  },
};

module.exports = command;

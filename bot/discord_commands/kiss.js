const command = {
  name: 'kiss',

  action: (msg, args) => msg.channel.createMessage(`${msg.author.mention} just kissed ${args[0]}~! `),

  options: {
    aliases: ['kissu'],
    argsRequired: true,
    cooldown: 1000,
    description: '@ someone to kiss them!',
    usage: 'kiss @sushi',
  },
};

module.exports = command;

const command = {
  name: 'hug',

  action: (msg, args) => msg.channel.createMessage(`${msg.author.mention} just hugged ${args[0]}~! `),

  options: {
    aliases: ['huggy', 'hagu'],
    argsRequired: true,
    cooldown: 1000,
    description: '@ someone to hug them!',
    usage: 'hug @sushi',
  },
};

module.exports = command;

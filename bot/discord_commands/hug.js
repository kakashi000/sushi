const command = {};

command.name = 'hug';

command.action = (msg, args) => msg.channel.createMessage(`${msg.author.mention} just hugged ${args[0]}~! `);

command.options = {
  aliases: ['huggy', 'hagu'],
  argsRequired: true,
  cooldown: 1000,
  description: '@ someone to hug them!',
  usage: 'hug @sushi',
};

module.exports = command;
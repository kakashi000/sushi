const command = {};

command.name = 'hug';

command.action = (msg, args) => msg.channel.createMessage(`${msg.author.mention} just hugged ${args[0]}~! `);

command.options = {
  aliases: ['huggy', 'hagu'],
  description: '@ someone to hug them!',
  errorMessage: 'Something went wrong with that command.',
  usage: 'hug @sushi',
};

module.exports = command;

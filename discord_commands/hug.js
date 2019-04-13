const command = {};

command.name = 'hug';

command.action = (msg) => {
  const { mentions } = msg;
  const len = msg.mentions.length;
  if (!mentions[0] || msg.author.mention === mentions[0].mention) {
    return msg.channel.createMessage(`${msg.author.mention} just hugged themselves?`);
  }
  if (len === 1) {
    return msg.channel.createMessage(`${msg.author.mention} just hugged ${mentions[0].mention}! `);
  }
  if (len === 2) {
    return msg.channel.createMessage(`${msg.author.mention} just hugged ${mentions[0].mention} and ${mentions[1].mention}! `);
  }
  // if several people are mentioned:
  let message = `${msg.author.mention} just hugged `;
  mentions.slice(0, (len - 1)).forEach(
    (user) => { message += `${user.mention}, `; },
  );
  message += `and ${mentions[len - 1].mention}!`;
  // @author just hugged @mention1, @mention2, and @mention3!
  return msg.channel.createMessage(message);
};

command.options = {
  aliases: ['h', 'hagu'],
  description: '@ someone to hug them!',
  fullDescription: 'Say ;hug @someone to kiss them!',
  errorMessage: 'Something went wrong with that command.',
  invalidUsageMessage: 'Say ;hug @someone to kiss them!',
};

module.exports = command;

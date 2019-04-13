const command = {};

command.name = 'avatar';

command.action = (msg, args) => {
  if (!args[0]) {
    return msg.channel.createMessage(msg.author.avatarURL);
  }
  return msg.channel.createMessage(msg.mentions[0].avatarURL);
};

command.options = {
  aliases: ['av', 'pfp'],
  description: 'Get the URL of a user\'s avatar',
  errorMessage: 'Something went wrong with that command.',
  fullDescription: 'Say ;avatar [keyword] to get the URL of a user\'s avatar~',
};

module.exports = command;

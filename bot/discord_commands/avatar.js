const command = {
  name: 'avatar',

  action: (msg, args) => {
    if (!args[0]) {
      return msg.channel.createMessage(msg.author.avatarURL);
    }

    return msg.channel.createMessage(msg.mentions[0].avatarURL);
  },

  options: {
    aliases: ['av', 'pfp'],
    argsRequired: true,
    cooldown: 3000,
    description: 'Get the URL of a user\'s avatar!',
    usage: 'avatar @sushi',
  },
};

module.exports = command;

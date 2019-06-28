const command = {
  name: 'avatar',

  action: (msg) => {
    if (!msg.mentions[0]) {
      return msg.channel.createMessage(msg.author.avatarURL);
    }

    return msg.channel.createMessage(msg.mentions[0].avatarURL);
  },

  options: {
    aliases: ['av', 'pfp'],
    cooldown: 3000,
    description: 'Get the URL of a user\'s avatar!',
    usage: 'avatar @sushi',
  },
};

module.exports = command;

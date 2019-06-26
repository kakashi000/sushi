const command = {
  name: 'invite',

  action: (msg) => {
    const inviteMessage = `
  You can use this link to invite me to your server!
  <https://discordapp.com/oauth2/authorize?client_id=561092137601597440&scope=bot>
    `;

    return msg.channel.createMessage(inviteMessage);
  },

  options: {
    aliases: ['invite-bot'],
    cooldown: 3000,
    description: 'Get a link to invite me to your server!',
    usage: 'invite',
    reactionButtonTimeout: 120000,
  },
};

module.exports = command;

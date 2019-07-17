const command = {
  name: 'emote',

  action: async (msg, args) => {
    const emojiIDRegex = new RegExp('\\d+', 'g');
    const match = args.join(' ').match(emojiIDRegex);

    if (match) {
      const links = match.map(emojiID => `https://cdn.discordapp.com/emojis/${emojiID}.png`);

      return msg.channel.createMessage(links.join('\n'));
    }

    return msg.channel.createMessage('No custom emotes found~');
  },

  options: {
    aliases: ['se'],
    argsRequired: true,
    cooldown: 3000,
    description: 'Get the full image of one or more custom emotes!',
    usage: 'se :customEmote:',
  },
};

module.exports = command;

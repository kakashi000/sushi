const command = {};

command.name = 'emote';

command.action = async (msg, args) => {
  const emojiIDRegex = new RegExp('\\d+', 'g');
  const match = args.join(' ').match(emojiIDRegex);
  if (match) {
    let links = '';
    match.forEach((emojiID) => {
      links += `https://cdn.discordapp.com/emojis/${emojiID}.png \n`;
    });
    return msg.channel.createMessage(links);
  }
  return msg.channel.createMessage('No custom emotes found~');
};

command.options = {
  aliases: ['se'],
  cooldown: 3000,
  description: 'Get the full image of one or more custom emotes!',
  usage: 'se :customEmote:',
};

module.exports = command;

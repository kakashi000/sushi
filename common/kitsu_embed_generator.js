const config = require('../config/config.json');

function generateEmbed(type, item, msg, currentPage, lastPage, bot) {
  const synopsis = (item.attributes.synopsis.length < 700)
    ? item.attributes.synopsis : `${item.attributes.synopsis.substr(0, 700)}...`;

  const embed = {
    embed: {
      title: `Kitsu ${type} Search`,
      description: `Page ${(currentPage)} out of ${(lastPage)}`,
      color: config.color,
      author: {
        icon_url: bot.user.avatarURL,
      },
      fields: [
        {
          name: 'Title',
          value: (item.attributes.canonicalTitle === '\n\n')
            ? 'No title found.' : item.attributes.canonicalTitle,
        },
        {
          name: 'Type',
          value: (item.attributes.subtype === '\n\n')
            ? 'No type found.' : item.attributes.subtype,
        },
        {
          name: 'Synopsis',
          value: (synopsis === '\n\n')
            ? 'No synopsis found.' : synopsis,
        },
      ],
      thumbnail: {
        url: item.attributes.posterImage.small,
      },
      timestamp: new Date(),
      footer: {
        icon_url: msg.author.avatarURL,
        text: `${msg.author.username} can tap the reaction buttons below to switch pages!`,
      },
    },
  };

  return embed;
}

module.exports = generateEmbed;

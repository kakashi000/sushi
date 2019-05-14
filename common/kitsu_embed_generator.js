const config = require('../config/config.json');
const bot = require('../bot.js');

function generateEmbed(type, item, msg, currentPage, lastPage) {
  const hasAddReactionsPermission = msg.channel.permissionsOf(bot.user.id).has('addReactions');

  if (type === 'Anime' || type === 'Manga') {
    const synopsis = (item.attributes.synopsis.length < 700)
      ? item.attributes.synopsis
      : `${item.attributes.synopsis.substr(0, 700)}...`;

    const embed = {
      embed: {
        title: `Kitsu ${type} Search`,
        description: hasAddReactionsPermission
          ? `Page ${(currentPage)} out of ${(lastPage)}` : '',
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
          text: hasAddReactionsPermission
            ? `${msg.author.username} can tap the reaction buttons below to switch pages!`
            : 'Powered by Kitsu.io',
        },
      },
    };

    return embed;
  }

  if (type === 'Character') {
    const name = item.canonicalName;

    const description = item.description.length < 700
      ? item.description
      : `${item.description.substr(0, 700)}...`;

    const embed = {
      embed: {
        title: `Kitsu ${type} Search`,
        description: hasAddReactionsPermission
          ? `Page ${(currentPage)} out of ${(lastPage)}` : '',
        color: config.color,
        author: {
          icon_url: bot.user.avatarURL,
        },
        fields: [
          {
            name: 'Name',
            value: name,
          },
          {
            name: 'Description',
            value: description || 'No description found.',
          },
        ],
        thumbnail: {
          url: item.image
            ? item.image.original
            : '',
        },
        timestamp: new Date(),
        footer: {
          icon_url: msg.author.avatarURL,
          text: hasAddReactionsPermission
            ? `${msg.author.username} can tap the reaction buttons below to switch pages!`
            : 'Powered by Kitsu.io',
        },
      },
    };
    return embed;
  }
}

module.exports = generateEmbed;

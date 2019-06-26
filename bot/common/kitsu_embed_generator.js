const Kitsu = require('kitsu');
const config = require('../config/config.json');
const bot = require('../bot.js');

const api = new Kitsu();

const embedGenerator = {};

embedGenerator.generateKitsuEmbed = (type, item, msg, currentPage, lastPage) => {
  const hasAddReactionsPermission = msg.channel.permissionsOf(bot.user.id).has('addReactions');

  if (type === 'Anime' || type === 'Manga') {
    const synopsis = (item.synopsis.length < 700)
      ? item.synopsis
      : `${item.synopsis.substr(0, 700)}...`;

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
            value: (item.canonicalTitle === '\n\n')
              ? 'No title found.' : item.canonicalTitle,
          },
          {
            name: 'Type',
            value: (item.subtype === '\n\n')
              ? 'No type found.' : item.subtype,
          },
          {
            name: 'Synopsis',
            value: (synopsis === '\n\n')
              ? 'No synopsis found.' : synopsis,
          },
        ],
        thumbnail: {
          url: item.posterImage.small,
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

    let description = item.description;
    if (description.length > 700) {
      description = `${description.substring(0, 700)}...`;
    }

    const openingSpanCount = (description.match(/<span class="spoiler">/g) || []).length;
    const closingSpanCount = (description.match(/<\/span>/g) || []).length;
    if (openingSpanCount !== closingSpanCount) {
      description += '</span>';
    }

    const brRegex = new RegExp('<brs*/?>', 'mg');
    const spoilerRegex = new RegExp('</?span( )?(class="spoiler")?>', 'mg');
    description = description.replace(brRegex, '\n');
    description = description.replace(spoilerRegex, '||');

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
};

embedGenerator.generateEmbeds = async (type, msg, args) => {
  const text = args.join(' ');

  const options = {
    filter: type === 'Character'
      ? { name: text }
      : { text },
  };

  const response = await api.get(type, options);

  if (!response.data[0]) {
    return;
  }

  const embeds = response.data.map((item, index, data) => (
    embedGenerator.generateKitsuEmbed(type, item, msg, (index + 1), data.length)
  ));

  return embeds;
};

module.exports = embedGenerator;

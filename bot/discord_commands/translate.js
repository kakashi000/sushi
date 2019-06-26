const got = require('got');
const config = require('./../config/config.json');

const command = {
  name: 'translate',

  action: async (msg, args) => {
    const text = args.slice(1).join(' ');
    const lang = args[0];

    const options = {
      json: true,
      query: {
        key: config.translateKey,
        text,
        lang,
      },
      headers: {
        'User-Agent': 'Request-Promise',
      },
    };

    const response = await got('https://translate.yandex.net/api/v1.5/tr.json/translate', options);
    const textTranslated = decodeURIComponent(response.body.text[0]);

    const translationInfo = {
      embed: {
        color: config.color,
        title: 'Translation',
        fields: [{
          name: 'Your text:',
          value: text,
        },
        {
          name: 'translates to~',
          value: textTranslated,
        },
        ],
      },
    };

    return msg.channel.createMessage(translationInfo);
  },

  options: {
    aliases: ['trans', 'tr'],
    argsRequired: true,
    cooldown: 3000,
    description: 'Translates text using Yandex.Translate!',
    usage: 'trans en-ja cute',
  },
};

module.exports = command;

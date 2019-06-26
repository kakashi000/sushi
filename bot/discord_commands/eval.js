/* eslint-disable no-unused-vars */
/* eslint-disable no-eval */
const util = require('util');
const config = require('../config/config.json');
const bot = require('../bot.js');
const db = require('../db/database.js');

const command = {
  name: 'eval',

  action: async (msg, args) => {
    const clean = (text) => {
      if (typeof (text) === 'string') return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
      return text;
    };

    try {
      const code = args.join(' ');
      let evaled = await eval(code);
      if (typeof evaled !== 'string') {
        evaled = util.inspect(evaled);
      }
      await msg.channel.createMessage(`\`\`\`xl\n${clean(evaled)}\n\`\`\``);
    } catch (err) {
      await msg.channel.createMessage(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  },

  options: {
    aliases: ['evaluate'],
    argsRequired: true,
    cooldown: 0,
    description: 'Evaluate some JavaScript!',
    usage: 'eval Math.Random()',
    hidden: true,
    requirements: {
      userIDs: config.botOwnerIDs,
    },
    permissionMessage: 'Only the bot owner can use that command.',
  },
};

module.exports = command;

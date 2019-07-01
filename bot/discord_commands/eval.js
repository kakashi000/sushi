/* eslint-disable no-unused-vars */
/* eslint-disable no-eval */
const util = require('util');
const config = require('../config/config.json');
const bot = require('../bot.js');
const db = require('../db/database.js');
const pagination = require('../common/pagination.js');
const { setPrefix, getPrefix, getGuildPrefixes } = require('../util/prefix_manager.js');
const logData = require('../util/logger.js');

const clean = (text) => {
  if (typeof (text) === 'string') return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
  return text;
};

const command = {
  name: 'eval',

  action: async (msg, args) => {
    const send = content => msg.channel.createMessage(content);

    try {
      const code = args.filter(arg => (!arg.startsWith('`'))).join(' ');
      let evaled = await eval(code);
      if (typeof evaled !== 'string') {
        evaled = util.inspect(evaled);
      }
      return;
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

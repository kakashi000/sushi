/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-eval */
const util = require('util');
const config = require('../config/config.json');
const bot = require('../bot.js');
const storage = require('../config/storage.js');

const command = {};

command.name = 'eval';

command.action = async (msg, args) => {
  const authorIsBotOwner = config.botOwnerIDs.find(id => id === msg.author.id);

  if (!authorIsBotOwner) {
    return msg.channel.createMessage('Only the bot owner can use that command.');
  }

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
};

command.options = {
  aliases: ['evaluate'],
  cooldown: 0,
  description: 'Evaluate some JavaScript!',
  usage: 'eval Math.Random()',
  hidden: true,
};

module.exports = command;

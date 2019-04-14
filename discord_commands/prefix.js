const storage = require('../config/storage.js');
const bot = require('../bot.js');

const command = {};

command.name = 'prefix';

command.action = async (msg, args) => {
  if (!args[0]) {
    const guild = await storage.getItem(msg.channel.guild.id, {});
    if (guild.prefix.length === 1) {
      return msg.channel.createMessage(`The prefix is set to \`${guild.prefix}\``);
    }
    return msg.channel.createMessage(`Prefixes are set to \`${guild.prefix}\``);
  }
  bot.registerGuildPrefix(msg.channel.guild.id, args);
  await storage.editItem(msg.channel.guild.id, (guildConfig) => {
    const guild = guildConfig;
    guild.prefix = args;
    return guild;
  }, {});
  return msg.channel.createMessage(`The guild prefix is now set to \`${args.join(' ')}\`.`);
};

command.options = {
  description: 'Sets the guild prefix!',
  errorMessage: 'Something went wrong with that command.',
  requirements: {
    permissions: { administrator: true },
  },
  usage: 'prefix - /',
};

module.exports = command;

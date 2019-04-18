/* eslint-disable consistent-return */
/* eslint-disable no-console */
const requireDir = require('require-dir');
const bot = require('./bot.js');
const storage = require('./config/storage.js');

const commands = requireDir('./discord_commands');

bot.on('ready', async () => {
  const errorMessage = 'Something went wrong with that command.';

  // register bot commands
  Object.keys(commands).forEach((key) => {
    // add the default errorMessage if the command doesn't have one
    if (!commands[key].options.errorMessage) {
      commands[key].options.errorMessage = errorMessage;
    }
    // add the default cooldown message if the command doesn't have one
    if (!commands[key].options.cooldownMessage) {
      commands[key].options.cooldownMessage = `That command has a ${(commands[key].options.cooldown / 1000)} second cooldown.`;
    }
    bot.registerCommand(key, commands[key].action, commands[key].options);
  });

  //

  // register guild prefixes
  const guilds = Array.from(bot.guilds.values());
  const guildConfigPromises = guilds.map(guild => storage.getItem(guild.id, {}));
  const guildConfigs = await Promise.all(guildConfigPromises);

  for (let i = 0; i < guilds.length; i += 1) {
    const guild = guilds[i];
    const guildConfig = guildConfigs[i];
    if (guildConfig.prefix) {
      bot.registerGuildPrefix(guild.id, guildConfig.prefix);
    }
  }

  bot.editStatus('online', {
    name: '@ me!',
  });

  console.log('Ready!');
});

bot.on('error', (err) => {
  console.warn(err);
});

bot.on('messageCreate', async (msg) => {
  // check if message is a direct message
  if (!msg.channel.guild) {
    // ignore bot's own messages
    if (msg.author.bot) {
      return;
    }
    if (msg.content.startsWith('help')) {
      return msg.channel.createMessage(`Say \`${bot.commandOptions.prefix[0]}help\` to see my commands!`);
    }
  }

  // check if message has mentions
  if (!msg.mentions[0]) {
    return;
  }

  // check if the bot is mentioned at the start of the message
  const mentionRegex = new RegExp(`^<@!?${bot.user.id}>`);
  if (!mentionRegex.test(msg.content)) {
    return;
  }

  const guild = await storage.getItem(msg.channel.guild.id, {});
  if (guild.prefix) {
    return msg.channel.createMessage(`Say \`${guild.prefix[0]}help\` to see my commands!`);
  }

  return msg.channel.createMessage(`Say \`${bot.commandOptions.prefix[0]}help\` to see my commands!`);
});

bot.connect();

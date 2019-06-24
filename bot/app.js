const requireDir = require('require-dir');
const bot = require('./bot.js');
const logData = require('./util/logger.js');
const { movePage } = require('./common/pagination.js');
const { getGuildPrefixes, getPrefix } = require('./util/prefix_manager.js');

const commands = requireDir('./discord_commands');

bot.on('ready', async () => {
  const errorMessage = 'Something went wrong with that command.';

  Object.keys(commands).forEach((key) => {
    const options = commands[key].options;

    if (!options.hooks) {
      options.hooks = {};
    }

    if (!options.errorMessage) {
      options.errorMessage = errorMessage;
    }

    if (!options.cooldownMessage) {
      options.cooldownMessage = `That command has a ${(options.cooldown / 1000)} second cooldown.`;
    }

    if (!options.cooldownReturns) {
      options.cooldownReturns = 1;
    }

    if (options.argsRequired) {
      options.invalidUsageMessage = (msg) => {
        const parts = msg.content.split(' ').map(s => s.trim()).filter(s => s);
        const args = parts.slice(1);
        if (!args[0]) {
          commands.help.action(msg, [key]);
        }
      };
    }

    options.hooks.postExecution = (msg) => {
      logData(msg, msg.author, key);
    };

    bot.registerCommand(key, commands[key].action, options);
  });

  const guildPrefixes = await getGuildPrefixes();

  guildPrefixes.forEach((guild) => {
    bot.registerGuildPrefix(guild.id, guild.prefix);
  });

  bot.editStatus('online', {
    name: '@ me!',
  });

  console.log('Ready!');
});

bot.on('messageReactionAdd', (msg, emoji, userID) => {
  movePage(msg, emoji, userID);
});

bot.on('messageReactionRemove', (msg, emoji, userID) => {
  movePage(msg, emoji, userID);
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

  if (!msg.mentions[0]) {
    return;
  }

  // check if the bot is mentioned at the start of the message
  const mentionRegex = new RegExp(`^<@!?${bot.user.id}>`);

  if (!mentionRegex.test(msg.content)) {
    return;
  }

  const prefix = await getPrefix(msg.channel.guild.id);

  if (prefix) {
    return msg.channel.createMessage(`Say \`${prefix[0]}help\` to see my commands!`);
  }

  return msg.channel.createMessage(`Say \`${bot.commandOptions.prefix[0]}help\` to see my commands!`);
});

bot.on('error', (err) => {
  console.warn(err);
});

bot.connect();

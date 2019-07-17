const bot = require('./bot.js');
const loadCommands = require('./util/load_commands.js');
const { movePage } = require('./util/pagination_manager.js');
const { getGuildPrefixes, getPrefix } = require('./util/prefix_manager.js');

bot.on('ready', async () => {
  loadCommands();

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

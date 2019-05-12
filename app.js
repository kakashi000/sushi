const requireDir = require('require-dir');
const bot = require('./bot.js');
const storage = require('./config/storage.js');
const pagination = require('./common/pagination.js');

const commands = requireDir('./discord_commands');

bot.on('ready', async () => {
  const errorMessage = 'Something went wrong with that command.';

  // register bot commands
  Object.keys(commands).forEach((key) => {
    const options = commands[key].options;

    // add the default errorMessage if the command doesn't have one
    if (!options.errorMessage) {
      options.errorMessage = errorMessage;
    }

    if (!options.cooldownMessage) {
      options.cooldownMessage = `That command has a ${(options.cooldown / 1000)} second cooldown.`;
    }

    if (!options.cooldownReturns) {
      options.cooldownReturns = 1;
    }

    bot.registerCommand(key, commands[key].action, options);
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

function movePage(msg, emoji, userID) {
  if (emoji.name !== '⬅' && emoji.name !== '➡') {
    return;
  }

  if (!pagination.state[msg.id] || !pagination.state[msg.id].pages) {
    return;
  }

  const messageState = pagination.state[msg.id];

  if (messageState.authorID !== userID) {
    return;
  }

  if (emoji.name === '⬅') {
    if (messageState.pageNo === 0) {
      return;
    }
    pagination.state[msg.id].pageNo -= 1;
  } else if (emoji.name === '➡') {
    if ((messageState.pageNo + 1) === messageState.pages.length) {
      return;
    }
    pagination.state[msg.id].pageNo += 1;
  }

  bot.editMessage(msg.channel.id, msg.id, messageState.pages[(messageState.pageNo)]);
}

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

bot.on('error', (err) => {
  console.warn(err);
});

bot.connect();

/* eslint-disable consistent-return */
/* eslint-disable no-console */
const requireDir = require('require-dir');
const bot = require('./bot.js');
const config = require('./config/config.json');
const storage = require('./config/storage.js');

const commands = requireDir('./discord_commands');

bot.on('ready', async () => {
  // register bot commands and generate help embed fields
  Object.keys(commands).forEach((key) => {
    bot.registerCommand(key, commands[key].action, commands[key].options);
  });

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

  bot.registerCommand('help', async (msg, args) => {
    const helpEmbed = {
      embed: {
        description: '',
        color: config.color,
        author: {
          name: bot.user.username,
          icon_url: bot.user.avatarURL,
        },
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: 'made using the Eris library',
        },
        fields: [],
      },
    };
    const guild = await storage.getItem(msg.channel.guild.id, {});

    Object.keys(commands).forEach((key) => {
      helpEmbed.embed.fields.push({
        name: key,
        value: `${commands[key].options.description}\n\`${guild.prefix[0]}${commands[key].options.usage}\``,
      });
    });

    if (!args[0]) {
      return msg.channel.createMessage(helpEmbed);
    }
    return msg.channel.createMessage(helpEmbed);
  },
  {

  });

  bot.editStatus('online', {
    name: '@ me!',
  });

  console.log('Ready!');
});

bot.on('error', (err) => {
  console.warn(err);
});

bot.on('messageCreate', async (msg) => {
  if (!msg.mentions[0]) {
    return;
  }

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

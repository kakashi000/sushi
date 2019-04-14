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
    const guild = await storage.getItem(msg.channel.guild.id, {});
    if (!args[0]) {
      const help = {
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

      // add a field for each command
      Object.keys(commands).forEach((key) => {
        help.embed.fields.push({
          name: key,
          value: `${commands[key].options.description}\n\`${guild.prefix[0]}${commands[key].options.usage}\``,
        });
      });
      return msg.channel.createMessage(help);
    }

    let commandName = args[0];

    // check if there's a command for the given name/alias
    if (!bot.commandAliases[commandName] && !bot.commands[commandName]) {
      return msg.channel.createMessage('Command not found~');
    }

    if (!bot.commandAliases[commandName]) {
      Object.keys(bot.commandAliases).forEach((key) => {
        if (commandName === bot.commandAliases[key]) {
          commandName = key;
        }
      });
    }

    const commandHelp = {
      embed: {
        color: config.color,
        title: bot.commands[bot.commandAliases[commandName]].name,
        description: bot.commands[bot.commandAliases[commandName]].description,
        fields: [
          {
            name: 'Usage',
            value: `\`${guild.prefix[0]}${bot.commands[bot.commandAliases[commandName]].usage}\``,
          },
        ],
      },
    };

    return msg.channel.createMessage(commandHelp);
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

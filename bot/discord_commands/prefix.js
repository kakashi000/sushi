const { setPrefix, getPrefix } = require('../util/prefix_manager.js');

const command = {};

command.name = 'prefix';

command.action = async (msg, args) => {
  if (!args[0]) {
    const prefix = await getPrefix(msg.channel.guild.id);

    if (prefix.length === 1) {
      return msg.channel.createMessage(`The prefix is set to \`${prefix}\``);
    }

    return msg.channel.createMessage(`Prefixes are set to \`${prefix}\``);
  }

  await setPrefix(msg.channel.guild, args);

  return msg.channel.createMessage(`The guild prefix is now set to \`${args.join(' ')}\`.`);
};

command.options = {
  aliases: ['pr'],
  cooldown: 1000,
  description: 'Sets the guild\'s command prefixes!',
  fullDescription: `
Sets the guild's command prefixes. \`{prefix}prefix =\` sets the current prefixes setting to \`=\`.

You can give the command a space-separated list to set multiple prefixes, like so:
\`{prefix}prefix > = s!\`

The bot will recognize all three (>, =, and -) as valid prefixes, and you can use them normally;
\`>help\`, \`=help\`, and \`s!help\` will all work.

You can also type \`{prefix}prefix\` alone to check the current setting.
  `,
  guildOnly: true,
  requirements: {
    permissions: { administrator: true },
  },
  usage: 'prefix >',
};

module.exports = command;

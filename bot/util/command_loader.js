/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const bot = require('../bot.js');
const logData = require('./logger.js');

function loadCommands() {
  const commandsPath = path.join(__dirname, '../discord_commands');
  const commands = fs.readdirSync(commandsPath).map(file => require(`../discord_commands/${file}`));
  const errorMessage = 'Something went wrong with that command.';

  commands.forEach((command) => {
    const options = command.options;

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
          commands.help.action(msg, command.name);
        }
      };
    }

    options.hooks.postExecution = (msg) => {
      logData(msg, msg.author, command.name);
    };

    bot.registerCommand(command.name, command.action, options);
  });
}

module.exports = loadCommands;

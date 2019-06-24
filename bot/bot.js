const Eris = require('eris');
const config = require('./config/config.json');

const botOptions = { defaultImageSize: 512 };

const commandOptions = {
  prefix: ['s!'],
  defaultHelpCommand: false,
};

const bot = new Eris.CommandClient(config.botToken, botOptions, commandOptions);

module.exports = bot;

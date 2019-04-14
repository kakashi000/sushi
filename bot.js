const Eris = require('eris');
const config = require('./config/config.json');

const botOptions = { restMode: true };
const commandOptions = {
  prefix: ['='],
  owner: 'kakashi',
  description: 'a bot made using Eris',
  defaultHelpCommand: false,
};
const bot = new Eris.CommandClient(config.botToken, botOptions, commandOptions);

module.exports = bot;

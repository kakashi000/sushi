/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
const bot = require('../bot.js');

const pagination = {};

pagination.state = {};

pagination.saveData = (msgID, pages, authorID, timeout) => {
  pagination.state[msgID] = {
    pages,
    authorID,
    pageNo: 0,
  };
  setTimeout(() => delete pagination.state[msgID], timeout);
  return pages;
};

pagination.addReactionButtons = (command) => {
  const commandCopy = { ...command };

  commandCopy.options.hooks = {
    postCommand: (msg, args, res) => {
      pagination.state[res.id] = pagination.state[msg.id];
      if (!pagination.state[res.id]) {
        return;
      }
      bot.addMessageReaction(res.channel.id, res.id, '⬅');
      bot.addMessageReaction(res.channel.id, res.id, '➡');
    },
  };
  return commandCopy;
};

module.exports = pagination;
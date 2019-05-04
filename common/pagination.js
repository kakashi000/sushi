/* eslint-disable consistent-return */
const bot = require('../bot.js');

const pagination = {};

pagination.saveData = (msgID, data, authorID) => {
  bot.persistence[msgID] = {
    pages: data,
    authorID,
    pageNo: 0,
  };
  return data;
};

pagination.addReactionButtons = (command) => {
  const commandCopy = { ...command };

  commandCopy.options.hooks = {
    postCommand: (msg, args, res) => {
      bot.persistence[res.id] = bot.persistence[msg.id];
    },
  };

  commandCopy.options.reactionButtons = [];

  commandCopy.options.reactionButtons.push(
    {
      emoji: '⬅',
      type: 'edit',
      response: (msg, args, userID) => {
        const persistence = bot.persistence[msg.id];
        if (persistence.authorID !== userID) {
          return;
        }
        if (persistence.pageNo === 0) {
          return;
        }
        bot.persistence[msg.id].pageNo -= 1;
        return persistence.pages[(persistence.pageNo)];
      },
    },
  );

  commandCopy.options.reactionButtons.push(
    {
      emoji: '➡',
      type: 'edit',
      response: (msg, args, userID) => {
        const persistence = bot.persistence[msg.id];
        if (persistence.authorID !== userID) {
          return;
        }
        if (persistence.pageNo === persistence.pages.length) {
          return;
        }
        bot.persistence[msg.id].pageNo += 1;
        return persistence.pages[(persistence.pageNo)];
      },
    },
  );

  return commandCopy;
};

module.exports = pagination;

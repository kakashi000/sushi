const bot = require('../bot.js');

const pagination = {};

pagination.state = {};

pagination.saveData = (msgID, pages, authorID, timeout, pageNumber) => {
  pagination.state[msgID] = {
    pages,
    authorID,
    pageNo: pageNumber || 0,
  };
  setTimeout(() => delete pagination.state[msgID], timeout);
  return pages;
};

pagination.addReactionButtons = (command, timeout) => {
  const commandCopy = { ...command };

  commandCopy.options.hooks = {
    postCommand: (msg, args, res) => {
      if (!res) {
        return;
      }

      pagination.state[res.id] = pagination.state[msg.id];
      setTimeout(() => delete pagination.state[res.id], timeout);

      if (!pagination.state[res.id]) {
        return;
      }

      const hasAddReactionsPermission = msg.channel.permissionsOf(bot.user.id).has('addReactions');
      if (hasAddReactionsPermission) {
        bot.addMessageReaction(res.channel.id, res.id, '⬅');
        bot.addMessageReaction(res.channel.id, res.id, '➡');
      }

      const hasManageMessagesPermission = msg.channel.permissionsOf(bot.user.id).has('manageMessages');
      if (hasManageMessagesPermission) {
        setTimeout(() => bot.removeMessageReactions(res.channel.id, res.id), timeout);
      }
    },
  };
  return commandCopy;
};

module.exports = pagination;

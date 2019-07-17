const bot = require('../bot.js');

const paginationManager = {
  state: {},

  saveData: (msgID, pages, authorID, timeout, pageNumber) => {
    paginationManager.state[msgID] = {
      pages,
      authorID,
      pageNo: pageNumber || 0,
    };

    setTimeout(() => delete paginationManager.state[msgID], timeout);

    return pages;
  },

  addReactionButtons: (command) => {
    const commandCopy = { ...command };

    const timeout = commandCopy.options.reactionButtonTimeout;

    commandCopy.options.hooks = {
      postCommand: (msg, args, res) => {
        if (!res) {
          return;
        }

        paginationManager.state[res.id] = paginationManager.state[msg.id];

        setTimeout(() => {
          delete paginationManager.state[res.id];
        }, timeout);

        if (!paginationManager.state[res.id]) {
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
  },

  movePage: (msg, emoji, userID) => {
    if (emoji.name !== '⬅' && emoji.name !== '➡') {
      return;
    }

    if (!paginationManager.state[msg.id] || !paginationManager.state[msg.id].pages) {
      return;
    }

    const messageState = paginationManager.state[msg.id];

    if (messageState.authorID !== userID) {
      return;
    }

    if (emoji.name === '⬅') {
      if (messageState.pageNo === 0) {
        return;
      }

      paginationManager.state[msg.id].pageNo -= 1;
    } else if (emoji.name === '➡') {
      if ((messageState.pageNo + 1) === messageState.pages.length) {
        return;
      }

      paginationManager.state[msg.id].pageNo += 1;
    }

    bot.editMessage(msg.channel.id, msg.id, messageState.pages[(messageState.pageNo)]);
  },
};

module.exports = paginationManager;

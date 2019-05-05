/* eslint-disable consistent-return */

const pagination = {};
const state = {};

pagination.saveData = (msgID, pages, authorID, timeout) => {
  state[msgID] = {
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
      state[res.id] = state[msg.id];
    },
  };

  commandCopy.options.reactionButtons = [];

  commandCopy.options.reactionButtons.push(
    {
      emoji: '⬅',
      type: 'edit',
      response: (msg, args, userID) => {
        const messageState = state[msg.id];
        if (messageState.authorID !== userID) {
          return;
        }
        if (messageState.pageNo === 0) {
          return;
        }
        state[msg.id].pageNo -= 1;
        return messageState.pages[(messageState.pageNo)];
      },
    },
  );

  commandCopy.options.reactionButtons.push(
    {
      emoji: '➡',
      type: 'edit',
      response: (msg, args, userID) => {
        const messageState = state[msg.id];
        if (messageState.authorID !== userID) {
          return;
        }
        if (messageState.pageNo === messageState.pages.length) {
          return;
        }
        state[msg.id].pageNo += 1;
        return messageState.pages[(messageState.pageNo)];
      },
    },
  );

  return commandCopy;
};

module.exports = pagination;

const db = require('../db/database.js');

// TODO: add the important stats

const databaseManager = {
  getStats: async () => {
    try {
      const counts = db.query('SELECT * FROM counts;');
      const countsLastMonth = db.query('SELECT * from countsLastMonth');
      const data = await Promise.all([counts, countsLastMonth]);
      return {
        counts: data[0].rows[0],
        countsLastMonth: data[0].rows[0],
      };
    } catch (err) {
      console.warn(err);
    }
  },
};

module.exports = databaseManager;

const bot = require('../bot.js');
const db = require('../db/database.js');

const prefixManager = {
  getGuildPrefixes: async () => {
    try {
      const guildPrefixesQuery = {
        text: `
          SELECT snowflake_id AS id, prefix FROM guilds;
        `,
      };

      const guildPrefixes = await db.query(guildPrefixesQuery);

      return guildPrefixes.rows;
    } catch (err) {
      console.log(err.stack);
    }
  },

  getPrefix: async (guildId) => {
    try {
      const getPrefixQuery = {
        text: `
          SELECT prefix FROM guilds
          WHERE snowflake_id = $1;
        `,
        values: [guildId],
      };

      const prefix = await db.query(getPrefixQuery);

      if (!prefix.rows[0]) {
        return bot.commandOptions.prefix;
      }

      return prefix.rows[0].prefix.split(', ');
    } catch (err) {
      console.log(err.stack);
    }
  },

  setPrefix: async (guild, prefix) => {
    bot.registerGuildPrefix(guild.id, prefix);

    try {
      const setPrefixQuery = {
        text: `
          INSERT INTO guilds (snowflake_id, name, prefix, joined_at)
          VALUES ($1, $2, $3, to_timestamp($4 / 1000.0))
          ON CONFLICT (snowflake_id) DO UPDATE SET
          name = $2, prefix = $3
          RETURNING *;
        `,
        values: [guild.id, guild.name, `${prefix.join(', ')}`, Date.now()],
      };

      await db.query(setPrefixQuery);
    } catch (err) {
      console.log(err.stack);
    }
  },
};

module.exports = prefixManager;

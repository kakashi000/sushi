const db = require('../db/database.js');

async function logData(msg, user, commandName) {
  try {
    const usersQuery = {
      text: `
        INSERT INTO users (snowflake_id, username, discriminator, joined_at)
        VALUES ($1, $2, $3, to_timestamp($4 / 1000.0))
        ON CONFLICT (snowflake_id) DO UPDATE SET
        username = $2, discriminator = $3
        RETURNING *;
      `,
      values: [user.id, user.username, user.discriminator, Date.now()],
    };

    const commandsQuery = {
      text: `
        INSERT INTO commands (snowflake_id, user_id, command_used, used_at)
        VALUES ($1, $2, $3, to_timestamp($4 / 1000.0))
        RETURNING *;
      `,
      values: [msg.id, user.id, commandName, Date.now()],
    };

    await db.query(usersQuery);
    await db.query(commandsQuery);
  } catch (err) {
    console.log(err.stack);
  }
}

module.exports = logData;

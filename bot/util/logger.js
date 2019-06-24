const db = require('../db/database.js');

async function logData(user, commandName) {
  try {
    const usersQuery = {
      text: `
INSERT INTO users (snowflake_id, username, discriminator)
VALUES ($1, $2, $3)
ON CONFLICT (snowflake_id) DO UPDATE SET
username = $2, discriminator = $3
RETURNING *;
`,
      values: [user.id, user.username, user.discriminator],
    };

    let id = '';

    const userRes = await db.query(usersQuery);

    if (!userRes.rows[0]) {
      const idQuery = {
        text: 'SELECT id FROM users WHERE snowflake_id = $1',
        values: [user.id],
      };
      const idRes = await db.query(idQuery);
      id = idRes.rows[0].id;
    } else {
      id = userRes.rows[0].id;
    }

    const commandsQuery = {
      text: 'INSERT INTO commands (user_id, command_used, timestamp) VALUES ($1, $2, to_timestamp($3 / 1000.0)) RETURNING *',
      values: [id, commandName, Date.now()],
    };

    await db.query(commandsQuery);
  } catch (err) {
    console.log(err.stack);
  }
}

module.exports = logData;

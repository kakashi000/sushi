const Router = require('koa-router');
const { getStats } = require('../util/db_manager.js');

const router = new Router();

router.get('/stats', async (ctx, next) => {
  ctx.body = await getStats();
  next();
});

module.exports = router;

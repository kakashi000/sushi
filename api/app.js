const Koa = require('koa');
const stats = require('./routes/stats.js');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

app.on('error', (err) => {
  console.warn(err);
});

app.use(stats.routes());

app.listen(3000);

import Koa = require('koa');
import error from './utils/error';
import send from './utils/send';
import body from './utils/body';
import session from './utils/session';
import nunjucks from './utils/nunjucks';
import minifier from './utils/minifier';
import landing from './modules/landing';
import account from './modules/account';

const app = new Koa();

app.use(error);
app.use(send);
app.use(body);
app.use(minifier);
app.use(nunjucks);
app.use(session(app));

app.use(landing.routes()).use(landing.allowedMethods());
app.use(account.routes()).use(account.allowedMethods());

export default app;
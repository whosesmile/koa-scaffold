import Koa = require('koa');
import error from './middleware/error';
import send from './middleware/send';
import body from './middleware/body';
import favicon from './middleware/favicon';
import session from './middleware/session';
import nunjucks from './middleware/nunjucks';
import minifier from './middleware/minifier';

import landing from './modules/landing';
import account from './modules/account';
import toolkit from './modules/toolkit';

const app = new Koa();

app.use(error);
app.use(favicon);
app.use(send);
app.use(body);
app.use(minifier);
app.use(nunjucks);
app.use(session(app));

app.use(landing.routes()).use(landing.allowedMethods());
app.use(account.routes()).use(account.allowedMethods());
app.use(toolkit.routes()).use(toolkit.allowedMethods());

export default app;

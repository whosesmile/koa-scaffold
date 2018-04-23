import Router = require('koa-router');
import * as schema from './schema';
import * as routes from './routes';
import validator from '../../utils/validator';

const router = new Router({ prefix: '/account' });

router.get('/', validator(schema.account), routes.account);
router.get('/settings', validator(schema.settings), routes.settings);

export default router;

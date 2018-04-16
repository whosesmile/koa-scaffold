import Router = require('koa-router');
import * as schema from './schema';
import * as routes from './routes';
import validator from '../../utils/validator';

const router = new Router({ prefix: '/' });

router.get('/', validator(schema.home), routes.home);

export default router;
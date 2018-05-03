import Router = require('koa-router');
import * as schema from './schema';
import * as routes from './routes';
import validator from '../../utils/validator';

const router = new Router();

router.get('/', validator(schema.home), routes.home);
router.get('/hello', routes.hello);

export default router;

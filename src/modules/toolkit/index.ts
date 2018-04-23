import Router = require('koa-router');
import * as schema from './schema';
import * as routes from './routes';
import validator from '../../utils/validator';

const router = new Router({ prefix: '/toolkit' });

router.get('/example', routes.example);
router.post('/upload', validator(schema.upload), routes.upload);

export default router;

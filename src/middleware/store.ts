import * as redis from 'redis';
import { promisify } from 'util';
import logger from '../utils/logger';

interface StoreOptions extends redis.ClientOpts {
  client?: redis.RedisClient;
}

export default class RedisStore {
  client: redis.RedisClient;
  promiseGet: (sid: string) => Promise<string>;
  promiseSet: (sid: string, ttl: number, sess: string) => Promise<string>;
  promiseDel: (sid: string) => Promise<number>;
  constructor(options: StoreOptions) {
    logger.debug('Now session is based on redis');
    options.retry_strategy = options.retry_strategy || function (params) {
      if (params.error && params.error.code === 'ECONNREFUSED') {
        logger.error('Session redis connect failed, You can omit redis config in .env to resolve this');
        throw params.error;
      }
      if (params.attempt > 3) {
        throw params.error;
      }
      return params.attempt * 100;
    };
    this.client = options.client || redis.createClient(options);
    this.promiseGet = promisify(this.client.get.bind(this.client));
    this.promiseSet = promisify(this.client.setex.bind(this.client));
    this.promiseDel = promisify(this.client.del.bind(this.client));
  }

  async get(sid: string) {
    const data = await this.promiseGet(sid);
    try {
      return JSON.parse(data.toString());
    }
    catch (err) {
      return null;
    }
  }

  async set(sid: string, sess: object, ttl: number) {
    logger.debug(String(ttl));
    await this.promiseSet(sid, Math.ceil(ttl / 1000), JSON.stringify(sess));
  }

  async destroy(sid: string) {
    await this.promiseDel(sid);
  }
}

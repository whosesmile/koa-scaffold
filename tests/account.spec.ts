import 'dotenv/config';
import request = require('supertest');
import app from '../src/app';

describe('module /account', () => {
  const server = app.listen();

  test('get /account', () => {
    return request(server).get('/account')
      .expect(200);
  });

  test('get /account/settings', () => {
    return request(server).get('/account/settings')
      .expect(200);
  });

  server.close();
});
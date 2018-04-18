import 'dotenv/config';
import request = require('supertest');
import app from '../src/app';

describe('module landing', () => {
  const server = app.listen();

  test('get /', () => {
    return request(server).get('/')
      .expect(200);
  });

  server.close();
});
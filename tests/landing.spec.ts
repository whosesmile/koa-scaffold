import 'dotenv/config';
import request = require('supertest');
import app from '../src/app';

describe('module landing', () => {
  const server = app.listen();

  test('get /notfound html', () => {
    return request(server).get('/notfound')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect(404);
  });

  test('get /notfound text', () => {
    return request(server).get('/notfound')
      .set('Accept', 'text/plain')
      .expect('Content-Type', /plain/)
      .expect(404);
  });

  test('get /notfound json', () => {
    return request(server).get('/notfound')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .then(({ body }) => {
        expect(body.code).toBe(404);
      });
  });

  test('get /', () => {
    return request(server).get('/')
      .expect(200);
  });

  server.close();
});
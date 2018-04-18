import 'dotenv/config';
import request = require('supertest');
import app from '../src/app';

describe('module toolkit', () => {
  const server = app.listen();

  test('get /toolkit/example', () => {
    return request(server).get('/toolkit/example')
      .expect(200);
  });

  test('post /toolkit/upload', () => {
    return request(server).post('/toolkit/upload')
      .attach('file', './tests/vfigure.png')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.code).toBe(200);
        expect(body.list.length).toBe(1);
        expect(body.list[0]).toMatch(/^http/);
      });
  });

  server.close();
});
import 'dotenv/config';
import * as path from 'path';
import request = require('supertest');
import app from '../src/app';
import image from '../src/utils/image';

beforeAll(() => {
  image(path.resolve(__dirname, './material/upload.limit.jpeg'), 8800, 8800);
});

describe('module toolkit', () => {
  const server = app.listen();

  test('get /toolkit/example', () => {
    return request(server).get('/toolkit/example')
      .expect('Content-Type', /html/)
      .expect(200);
  });

  test('post /toolkit/upload: only allow image', () => {
    return request(server).post('/toolkit/upload')
      .attach('file', './tests/toolkit.spec.ts')
      .expect(422);
  });

  test('post /toolkit/upload: image size must bigger than 0', () => {
    return request(server).post('/toolkit/upload')
      .attach('file', './tests/material/upload.blank.jpeg')
      .expect(422);
  });

  test('post /toolkit/upload: image size must less than 2MB', () => {
    return request(server).post('/toolkit/upload')
      .attach('file', './tests/material/upload.limit.jpeg')
      .expect(422);
  });

  test('post /toolkit/upload: success', () => {
    return request(server).post('/toolkit/upload')
      .attach('file', './tests/material/upload.image.jpeg')
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

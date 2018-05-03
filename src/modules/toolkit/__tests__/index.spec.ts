import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import request = require('supertest');
import app from '../../../app';
import image from '../../../utils/image';

const NOT_A_IMAGE = path.resolve(__dirname, './index.spec.ts');
const BLANK_IMAGE = path.resolve(__dirname, '../upload.blank.jpeg');
const NORMAL_IMAGE = path.resolve(__dirname, '../upload.image.jpeg');
const LARGE_IMAGE = path.resolve(__dirname, '../upload.limit.jpeg');

beforeAll(() => {
  fs.closeSync(fs.openSync(BLANK_IMAGE, 'w'));
  image(NORMAL_IMAGE, 100, 100);
  image(LARGE_IMAGE, 8800, 8800);
});

afterAll(() => {
  fs.unlinkSync(BLANK_IMAGE);
  fs.unlinkSync(NORMAL_IMAGE);
  fs.unlinkSync(LARGE_IMAGE);
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
      .attach('file', NOT_A_IMAGE)
      .expect(422);
  });

  test('post /toolkit/upload: image size must bigger than 0', () => {
    return request(server).post('/toolkit/upload')
      .attach('file', BLANK_IMAGE)
      .expect(422);
  });

  test('post /toolkit/upload: image size must less than 2MB', () => {
    return request(server).post('/toolkit/upload')
      .attach('file', LARGE_IMAGE)
      .expect(422);
  });

  test('post /toolkit/upload: success', () => {
    return request(server).post('/toolkit/upload')
      .attach('file', NORMAL_IMAGE)
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

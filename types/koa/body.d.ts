import * as koa from 'koa';

declare module 'koa' {
  interface Request {
    body: any;
  }
}
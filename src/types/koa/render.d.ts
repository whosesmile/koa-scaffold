import * as koa from 'koa';

declare module 'koa' {
  interface Context {
    render: (name: string, context?: any) => string;
  }
}
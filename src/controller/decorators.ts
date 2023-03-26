import { RequestHandler } from 'express';
import router from '../router';

type Methods = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

// 类装饰器  可惜不知道何种原因 这种方式没有作用
export function Controller(target: any) {
  console.log(target.__proto__, target.prototype);
  for (let key in target.prototype) {
    const path = Reflect.getMetadata('path', target.prototype, key);
    const method: Methods = Reflect.getMetadata(
      'method',
      target.prototype,
      key
    );
    const middleware = Reflect.getMetadata('middleware', target.prototype, key);
    const handler = target.prototype[key];
    if (path && method && handler) {
      if (middleware) {
        router[method](path, middleware, handler);
      } else {
        router[method](path, handler);
      }
    }
  }
}

function getRequestDecorator(type: Methods) {
  return function (path: string, middleware?: RequestHandler) {
    return function (target: any, key: string) {
      Reflect.defineMetadata('path', path, target, key);
      Reflect.defineMetadata('method', type, target, key);
      if (middleware) router[type](path, middleware, target[key]);
      else router[type](path, target[key]);
    };
  };
}

// 方法装饰器
export const get = getRequestDecorator('get');

export const post = getRequestDecorator('post');
export const put = getRequestDecorator('put');
export const del = getRequestDecorator('delete');

export const use = function (middleware: RequestHandler) {
  return function (target: any, key: string) {
    Reflect.defineMetadata('middleware', middleware, target, key);
  };
};

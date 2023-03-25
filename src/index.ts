import express, { NextFunction, Request, Response } from 'express';

import bodyParse from 'body-parser';
import cookieSession from 'cookie-session';
import router from './router';

const app = express();
// <bodyParse> 请求中的body解析库 这里进行注册
app.use(bodyParse.urlencoded({ extended: false }));

app.use(
  cookieSession({
    name: 'session',
    keys: ['teacher dell'],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// app.use((req: Request, res: Response, next: NextFunction) => {
//   req.teacherName = 'dell';
//   next();
// });

// 注册路由
app.use(router);

app.listen(3000, () => {
  console.log('Start listening on http://localhost:3000');
});

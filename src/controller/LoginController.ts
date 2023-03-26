import 'reflect-metadata';

import { Controller, get, post } from './decorators';
import { Request, Response } from 'express';

import { getResponseData } from '../utils/utils';

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

@Controller
class LoginController {
  @post('/login')
  login(req: BodyRequest, res: Response) {
    const { password } = req.body;
    const isLogin = req.session ? req.session.login : false;
    if (isLogin) {
      res.json(getResponseData('已经登陆过了哦'));
    } else {
      if (password === '123' && req.session) {
        req.session.login = true;
        res.json(getResponseData('登录成功'));
      } else {
        res.send('密码错误');
      }
    }
  }

  @get('/')
  home(req: BodyRequest, res: Response) {
    const isLogin = req.session ? req.session.login : false;
    if (isLogin) {
      res.send(`
      <!DOCTYPE html>
        <body>
        <a href='logout'>退出</a>
        </body>
      </html>
      `);
    } else {
      res.send(`
      <html>
        <body>
          <form method="post" action="/login">
              <input type="password" name="password">
              <button type="submit">登录</button>
          </form>
        </body>
      </html>
    `);
    }
  }
  @get('/logout')
  logout(req: BodyRequest, res: Response) {
    req.session && (req.session.login = false);
    res.json(getResponseData('退出成功'));
  }
}

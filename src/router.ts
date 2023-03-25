import { NextFunction, Request, Response, Router } from 'express';

import Analyzer from './utils/dellAnalyzer';
import Croller from './utils/croller';
import fs from 'fs';
import { getResponseData } from './utils/utils';
import path from 'path';

const router = Router();

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

// 中间件
const checkLogin = (req: BodyRequest, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, '清先登录'));
  }
};

router.get('/', (req: BodyRequest, res: Response) => {
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
});
// 中间件应用
router.get('/logout', checkLogin, (req: BodyRequest, res: Response) => {
  req.session && (req.session.login = false);
  res.json(getResponseData('退出成功'));
});

router.post('/login', (req: BodyRequest, res: Response) => {
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
});

router.get('/getData', checkLogin, (req: BodyRequest, res: Response) => {
  const secret = 'secretKey';
  const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
  const analyzer = Analyzer.getInstance();
  new Croller(url, analyzer);
  res.json(getResponseData('Get Data Success!'));
});

router.get('/showData', checkLogin, (req: BodyRequest, res: Response) => {
  try {
    const fileContent = fs.readFileSync(
      path.join(__dirname, '../data/course.json'),
      'utf-8'
    );
    res.json(getResponseData(JSON.parse(fileContent)));
  } catch (error) {
    res.json(getResponseData(null, '数据为空 还没爬取呢~'));
  }
});

export default router;

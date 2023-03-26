import 'reflect-metadata';

import { Controller, get, use } from './decorators';
import { NextFunction, Request, Response } from 'express';

import Analyzer from '../utils/dellAnalyzer';
import Croller from '../utils/croller';
import fs from 'fs';
import { getResponseData } from '../utils/utils';
import path from 'path';

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

@Controller
class CrollerController {
  @get('/getData', checkLogin)
  @use(checkLogin)
  getData(req: BodyRequest, res: Response) {
    const secret = 'secretKey';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = Analyzer.getInstance();
    new Croller(url, analyzer);
    res.json(getResponseData('Get Data Success!'));
  }

  @get('/showData', checkLogin)
  @use(checkLogin)
  showData(req: BodyRequest, res: Response) {
    try {
      const fileContent = fs.readFileSync(
        path.join(__dirname, '../../data/course.json'),
        'utf-8'
      );
      res.json(getResponseData(JSON.parse(fileContent)));
    } catch (error) {
      res.json(getResponseData(null, '数据为空 还没爬取呢~'));
    }
  }
}

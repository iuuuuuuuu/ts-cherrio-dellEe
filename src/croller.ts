// ts -> js  ts直接引入js 会报错
// ts -> .d.ts 翻译文件 -> js 就不会报错了 就比如 superagent 就可以安装 @types/superagent 就可以避免了

import DellAnalyzer from './dellAnalyzer';
import fs from 'fs';
import path from 'path';
import superagent from 'superagent';

export interface Analyze {
  analyze: (html: string, filePath: string) => string;
}

class Croller {
  private filePath: string = path.resolve(__dirname, '../data/course.json');
  constructor(
    private url: string,
    // 两种方式 我是比较建议直接用class类作声明的毕竟比较方便
    private analyzer: Analyze // private analyzer: DellAnalyzer
  ) {
    this.initSpiderProcess();
  }
  async initSpiderProcess() {
    const html = await this.getRawHtml();
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }
  private async getRawHtml() {
    const res = await superagent.get(this.url);
    return res.text;
  }
  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }
}

const secret = 'secretKey';
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;

const analyzer = DellAnalyzer.getInstance();
const croller = new Croller(url, analyzer);

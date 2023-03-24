import { Analyze } from './croller';
import cheerio from 'cheerio';
import fs from 'fs';

interface Course {
  title: string;
  count: number;
}
interface CourseResult {
  timer: number;
  data: Course[];
}
interface Content {
  [propName: number]: Course[];
}
// 类的 声明注解应该这么写
// 单例模式
export default class DellAnalyzer implements Analyze {
  private static instance: DellAnalyzer;
  static getInstance(): DellAnalyzer {
    if (!DellAnalyzer.instance) DellAnalyzer.instance = new DellAnalyzer();
    return DellAnalyzer.instance;
  }
  private constructor() {}
  private getCourseInfo(html: string): CourseResult {
    const $ = cheerio.load(html);
    const courseItems = $('.course-item');
    const couseInfos: Course[] = [];
    courseItems.map((index, element) => {
      const descs = $(element).find('.course-desc');
      const title = descs.eq(0).text();
      const count = parseInt(descs.eq(1).text().split('：')[1], 10);
      couseInfos.push({
        title,
        count,
      });
    });
    const result = {
      timer: new Date().getTime(),
      data: couseInfos,
    };
    return result;
  }
  private generateJsonContent(
    courseInfo: CourseResult,
    filePath: string
  ): string {
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    fileContent[courseInfo.timer] = courseInfo.data;
    return JSON.stringify(fileContent);
  }
  public analyze(html: string, filePath: string): string {
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJsonContent(courseInfo, filePath);
    return fileContent;
  }
}

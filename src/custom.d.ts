// 这个会自动融合 所以不需要手动继承 还挺方便的
declare namespace Express {
  interface Request {
    teacherName: string;
  }
}

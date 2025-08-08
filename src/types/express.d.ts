declare namespace Express {
  export interface Request {
    user?: {
      sub: string;
      [key: string]: any;
    };
  }
}
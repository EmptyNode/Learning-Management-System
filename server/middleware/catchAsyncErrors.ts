import { NextFunction, Response } from "express";

export const CatchAsyncError =
  (theFunc: any) => (req: any, res: Response, next: NextFunction) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };

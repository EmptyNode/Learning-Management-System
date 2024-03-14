require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

//authenticated user
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;
    console.log(access_token)
    
    if (!access_token) {
      return next(new ErrorHandler("Login first to access this resource", 401));
    }
    console.log("hi")

    console.log(process.env.ACCESS_TOKEN as string);
    
    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;
    console.log("hi")
    

    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid", 401));
    }


    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    req.user = JSON.parse(user);
    next();
  }
);


//valid user roles 
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user?.role)
    console.log(req);
    
    if (!roles.includes(req.user?.role || '')) {
      return next(
        new ErrorHandler(
          `Role (${req.user?.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  }
}
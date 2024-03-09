import { NextFunction, Response } from "express";
import orderModel from "../models/orderModel";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";

//create new order
export const newOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await orderModel.create(req);

    res.status(200).json({
        success: true,
        order,
      });
  }
);

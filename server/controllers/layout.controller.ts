import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

//create layout
export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist) {
        return next(new ErrorHandler(`${type} already exists`, 400));
      }
      if (type === "Banner") {
        const { image, title, subTitle } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };
        await LayoutModel.create(banner);
      }
      if (type === "FAQ") {
        const { faq } = req.body;
        await LayoutModel.create({ type: "FAQ", faq });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        await LayoutModel.create({ type: "Categories", categories });
      }
      res.status(200).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit layout
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      if (type === "Banner") {
        const { image, title, subTitle } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };
        await LayoutModel.findOneAndUpdate({ type: "Banner" }, banner);
      }
      if (type === "FAQ") {
        const { faq } = req.body;
        await LayoutModel.findOneAndUpdate({ type: "FAQ" }, { faq });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        await LayoutModel.findOneAndUpdate({ type: "Categories" }, { categories });
      }
      res.status(200).json({
        success: true,
        message: "Layout edited successfully",
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);
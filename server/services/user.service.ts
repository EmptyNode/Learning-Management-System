import { Response } from "express";
import userModel from "../models/user.model";
import { redis } from "../utils/redis";

//get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    return res.status(200).json({
      status: "success",
      user,
    });
  }
};

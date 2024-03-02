import express from "express";
import { registrationUser } from "../controllers/user.controllers";
const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
export default userRouter;
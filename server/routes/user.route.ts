import express from "express";
import { activateUser, loginUser, logoutUser, registrationUser } from "../controllers/user.controllers";
import { authorizeRoles, isAuthenticated } from './../middleware/auth';
const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticated, authorizeRoles("admin"),  logoutUser);

export default userRouter;

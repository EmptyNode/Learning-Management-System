import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { Secret } from "jsonwebtoken";
require('dotenv').config();
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";

//register user
interface IRegistrationBody {
    name: string;
    email: string;
    password: string;  
    avatar?: string; 
}

export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password} = req.body;

        const isEmailExist = await userModel.findOne({ email });

        if(isEmailExist) {
            return next(new ErrorHandler("Email already exists", 400));
        }

        const user: IRegistrationBody = {
            name,
            email,
            password
        }

        const activationToken = createActivationToken(user);


        const activationCode = activationToken.activationCode;
        console.log("hi")

        
        const data = {user: {name: user.name}, activationCode};
        console.log("hi")

        const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data);
        console.log("hi")
        
        try{
        console.log("hi")

            await sendMail({
                email: user.email,
                subject: "Account Activation",
                template: "activation-mail.ejs",
                data,
            });

            res.status(200).json({
                success: true,
                message: `Email sent to: ${user.email} for activation`,
                activationToken
            });
        }catch(error: any){
            return next(new ErrorHandler(error.message, 500));
        }   
        
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(user);

    const token = jwt.sign({
        user,activationCode
    },process.env.ACTIVATION_SECRET as Secret,{
        expiresIn: "5m"
    });
    console.log(process.env.ACTIVATION_SECRET);
    console.log(activationCode);

    return {token, activationCode};
}
































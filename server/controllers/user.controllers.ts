import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
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
            return res.status(400).json({ success: false, message: "Email already exists" });        }

        const user: IRegistrationBody = {
            name,
            email,
            password
        }

        const activationToken = createActivationToken(user);


        const activationCode = activationToken.activationCode;

        
        const data = {user: {name: user.name}, activationCode};

        const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data);
        
        try{

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

//activate use
interface IActivationRequest {
    activation_token: string,
    activation_code: string
}

export const activateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { activation_token, activation_code } = req.body as IActivationRequest;

        const newUser: {user: IUser, activationCode: string} = jwt.verify(activation_token, process.env.ACTIVATION_SECRET as string) as {user: IUser, activationCode: string};

        if(newUser.activationCode !== activation_code){
            return next(new ErrorHandler("Invalid activation code", 400));
        }


        const { name, email, password} = newUser.user;
        const existUser = await userModel.findOne({email});

        if(existUser){
            return next(new ErrorHandler("User already exists", 400));
        }


        const user = await userModel.create({
            name, email, password
        });



        res.status(200).json({
            success: true,
            message: "Account activated successfully",      
        });

    }catch(error: any){
        return next(new ErrorHandler(error.message, 500));
    }
})

//login user
interface IloginRequest {
    email: string;
    password: string;
}

export const loginUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { email, password } = req.body as IloginRequest;

        if(!email || !password){
            return next(new ErrorHandler("Please enter email and password", 400));
        }

        const user = await userModel.findOne({email}).select("+password");

        if(!user){
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        const isPasswordMatched = await user.comparePassword(password);

        if(!isPasswordMatched){
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        const token = user.getJwtToken();

        res.status(200).json({
            success: true,
            token
        });

    }catch(error: any){
        return next(new ErrorHandler(error.message, 500));
    }
}






























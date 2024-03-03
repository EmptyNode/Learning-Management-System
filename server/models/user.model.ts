require("dotenv").config();
import mongoose, {Document, Model, Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern : RegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: Array<{courseId: string}>;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Your name cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: {
            validator: function (v: string) {
                return emailRegexPattern.test(v);
            },
            message: (props: any) => `${props.value} is not a valid email address`
        },
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Your password must be longer than 6 characters"],
        select: false,
    },  
    avatar: {
        public_id: String,
        url: String,
    },  
    role: { 
        type: String,
        default: "user"
    },
    isVerified: {   
        type: Boolean,
        default: false
    },  
    courses: [
        {
            courseId: String,
        }
    ]

    },{timestamps: true}
)

//Hash Password before saving user
userSchema.pre<IUser>("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);       
    next();
})


// sign access token
userSchema.methods.SignAccessToken = function() {
    return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN || '', {expiresIn: process.env.ACCESS_TOKEN_EXPIRE});
}

// sign refresh token
userSchema.methods.SignRefreshToken = function() {
    return jwt.sign({id: this._id}, process.env.REFRESH_TOKEN || '', {expiresIn: process.env.REFRESH_TOKEN_EXPIRE});
}

//comapre passsword
userSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean>{
    return await bcrypt.compare(enteredPassword, this.password);
}

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;
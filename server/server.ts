import { log } from "console";
import { app } from "./app";
import connectDB from "./utils/db";
require("dotenv").config();
app.listen(process.env.PORT, ()=>{
    console.log(`the server is running on port ${process.env.PORT}`);
    connectDB();
})
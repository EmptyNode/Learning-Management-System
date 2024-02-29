import { log } from "console";
import { app } from "./app";
require("dotenv").config();
app.listen(process.env.PORT, ()=>{
    console.log(`the server is running on port ${process.env.PORT}`);
    
})
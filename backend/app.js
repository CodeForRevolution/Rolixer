const express=require("express");
const app=express();
const cookieParser =require("cookie-parser");
const cors=require("cors")
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
const errormiddleware=require("./middleware/error")
app.get("/",(req,res,next)=>{
  res.send("<h1>WellCome to Web Plant Pvt. Ltd. </h1>")
})
app.use("/api/v1/user/",require("./Route/userRoute"));//This structure should be followed as of now we are making it simple
app.use("/api/v1/task/",require("./Route/taskRoute"));//This structure should be followed as of now we are making it simple
app.use("/api/v1/transaction/",require("./Route/transaction"));//This structure should be followed as of now we are making it simple

//middleware for the Error
app.use(errormiddleware);
module.exports=app;
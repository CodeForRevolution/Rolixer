const catchAsyncError=require("../middleware/catchAsyncError");
const userModels = require("../model/userModels");
const ErrorHandler = require("./Errorhandler");
const jwt=require("jsonwebtoken")

exports.isAuthenticatedUser=catchAsyncError(async(req,res,next)=>{
    console.log("your cookies inserver",req.cookies.token)
    const token=req.cookies.token;
    
if(!token){
    console.log("are you in");
    return next(new ErrorHandler("Please login to access this resource",401));
}

const decodeData=jwt.verify(token,process.env.JWT_SECRET);
req.user=await userModels.findById(decodeData.id);


next();
});


exports.authorizeRoles=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
       return next(     new ErrorHandler(
                `Role :${req.user.role} is not allowed to access this resource`,403
            ));
        };
        next();
    }
}
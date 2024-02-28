const ErrorHandler=require("../utils/Errorhandler");


module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.message=err.message||"Internal Server Error";


//handling mongodb error

if(err.name=="CastError"){
    const message=`Resource not found ,Invalid:${err.path}`
    err=new ErrorHandler(message,400);

}
//mongoose duplicate key error
console.log("checking all info of erro",err)
if(err.code==11000){
    const message=`Duplicate ${Object.keys(err.keyValue)}`
    err=new ErrorHandler(message,400);
}

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
        error:err.stack
    });
};
const app=require("./app");
const dotenv=require("dotenv");
const connectDatabase=require("./config/database")

//Handling uncaought exception 

process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log('shutting down the server due to uncaught exceptions')
})

//config
dotenv.config({path:"backend/config/config.env"});
//connecting to the database
connectDatabase();
const server=app.listen(process.env.PORT,()=>{
    console.log("server is running on port",process.env.PORT)
});
process.on("unhandledRejection",(err)=>{//here we are handlint the unhandl rejection
    console.log(`Error:${err.message}`);
    console.log("shutting down the server due to unhandled prmise rejection");
    server.close(()=>{//here we are shutting down the server before that exiting from the process
        process.exit(1);//exiting from the process
    })
})


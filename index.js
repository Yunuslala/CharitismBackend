const express=require('express');
const { connection } = require('./config/db');
const {UserRouter}=require("./routers/UserRouter");
const {TodoRouter}=require("./routers/TodoRouter");

const errorMiddleware=require("./middleware/Error");
const app=express();
const cors=require("cors");


process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log("shutting down server due to Uncaught Exception");
    process.exit(1);
})
// app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use('/api/v1',UserRouter);
app.use('/api/v1',TodoRouter);





app.use(errorMiddleware)

const server=app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("db is connected")
    } catch (error) {
        console.log("db is not connected",error)
    }
    console.log(`http://localhost:${process.env.port}`)
})

process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`)
    console.log("shutting down server due to unhandled promise rejection")

    server.close(()=>{
        process.exit(1)
    })
})
const express=require('express');
const { connection } = require('./config/db');
const {UserRouter}=require("./routers/UserRouter");
const {TodoRouter}=require("./routers/TodoRouter");
const morgan = require('morgan');
const errorMiddleware=require("./middleware/Error");
const app=express();
const cors=require("cors");


process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log("shutting down server due to Uncaught Exception");
    process.exit(1);
})

app.use(express.json());
app.use(morgan('dev'));
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);



const corsOptions = {
    origin: `http://localhost:${process.env.port}`, 
    optionsSuccessStatus: 200,
  };
  
  app.use(cors(corsOptions));
  
app.get('/',async(req,res)=>{
    res.send({msg:"server is deployed"})
})


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
const AsyncerrorHandler = require("../middleware/AsyncErrorHandler");
const { ErrorHandler } = require("../utils/ErrorHandler");
const { UserModel}=require("../models/User.Model");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

module.exports = {
  CreateUser: AsyncerrorHandler(async (req, res, next) => {
    const {name,password,email}=req.body;
    const hash=await bcrypt.hash(password,10);
    const saveUser=new UserModel({
        name,email,password:hash
    })
    await saveUser.save();
    return res.status(201).send({
        success:true,
        msg:"User has been registered sucessfully",
    })
  }),
  UserLogin: AsyncerrorHandler(async (req, res, next) => {
    const  {email,password}=req.body;
    if(!email || !password){
        console.log("object")
        return next(new ErrorHandler(400,"Email And Password required"));
    }
    let finduser=await UserModel.findOne({email}).select("+password");
    if(!finduser){
        return next(new ErrorHandler(404,"Email is not registered go for signup first"))
    }
    console.log("object",finduser);
    let compare=await bcrypt.compare(password,finduser.password);
    if(compare){
        const token=await jwt.sign({UserId:finduser._id},process.env.secret,);
        return res.status(200).send({
            success:true,
            msg:"User has been login sucessfully",
            token,
            data:finduser
        })
    }else{
        return next(new ErrorHandler(400,"password is not correct"))
    }
  })
};

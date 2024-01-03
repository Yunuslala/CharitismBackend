const AsyncerrorHandler = require("../middleware/AsyncErrorHandler");
const { ErrorHandler } = require("../utils/ErrorHandler");
const { UserModel}=require("../models/User.Model");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const crypto = require('crypto');
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
  
        return next(new ErrorHandler(400,"Email And Password required"));
    }
    let finduser=await UserModel.findOne({email}).select("+password");
    if(!finduser){
        return next(new ErrorHandler(404,"Invalid User"))
    }

    let compare=await bcrypt.compare(password,finduser.password);
    if(compare){
        const iv = crypto.randomBytes(16); // 16 bytes for AES-256

        // Your payload
        const payload = { UserId: finduser._id };
        
        // Encrypt the payload
        const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(process.env.encryptionKey, 'hex'), iv);
        let encryptedData = cipher.update(JSON.stringify(payload), 'utf-8', 'hex');
        encryptedData += cipher.final('hex');
        
        // Create JWT token with the encrypted payload and IV
        const token = jwt.sign({ EncryptedPayload: encryptedData, IV: iv.toString('hex') }, process.env.secret);
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

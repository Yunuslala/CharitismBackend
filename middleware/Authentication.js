const express=require("express");
require('dotenv').config();
const AsyncErrorHandler=require("./AsyncErrorHandler");
const jwt=require("jsonwebtoken");
const { ErrorHandler } = require("../utils/ErrorHandler");
const crypto = require('crypto');
exports.Authentication=AsyncErrorHandler(
    async(req,res,next)=>{ 
    const token=req.headers.authorization;
    if(token){
        const decoded=jwt.verify(token,process.env.secret);
        if(decoded){
            const encryptedData = decoded.EncryptedPayload;

            const ivFromToken = Buffer.from(decoded.IV, 'hex');

            const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(process.env.encryptionKey, 'hex'), ivFromToken);
            let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
            decryptedData += decipher.final('utf-8');
            const decryptedPayload = JSON.parse(decryptedData);

             req.body.UserId=decryptedPayload.UserId;     
             next()
        }else{
            return next(new ErrorHandler(400,"Invalid token"))
        }
    }else{
        return next(new ErrorHandler(400,"Token is  required to use this resources"))
    }
}
)


const UserRouter=require("express").Router();

const {CreateUser,UserLogin} = require("../controller/User.Controller");

UserRouter.route("/User/Create").post(CreateUser)
UserRouter.route("/User/login").post(UserLogin);


module.exports={
    UserRouter
}
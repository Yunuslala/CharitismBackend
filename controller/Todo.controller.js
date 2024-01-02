const AsyncerrorHandler = require("../middleware/AsyncErrorHandler");
const { ErrorHandler } = require("../utils/ErrorHandler");
const {TodoModel}=require("../models/TodoModel");
module.exports = {
  createTodo: AsyncerrorHandler(async (req, res, next) => {
    const {UserId,Task}=req.body;
    const saveTask=new TodoModel({UserId,Task});
    await saveTask.save();
    return res.status(201).send({
        sucess:true,
        msg:"task has been created by user"
    })
  }),
  getAllTodo: AsyncerrorHandler(async (req, res, next) => {
    const getAllTodo=await TodoModel.find().populate('UserId',"name");
    if(getAllTodo.length==0){
        return next(new ErrorHandler(404,"Todo lists does not exist"))
    }
    return res.status(200).send({
        sucess:true,
        data:getAllTodo
    })

  }),
  UpdateUserTodoStatus: AsyncerrorHandler(async (req, res, next) => {
    const {UserId}=req.body;
    const {id}=req.params;
    const isExist=await TodoModel.findOne({_id:id});
    if(!isExist){
        return next(new ErrorHandler(404,"todo does not exist"))
    }else{
        const checkAUthorization=await TodoModel.findOne({_id:id,UserId});
        if(!checkAUthorization){
        return next(new ErrorHandler(400,"you are not authorized to update this task status"))

        }else{
            const updateStatus=await TodoModel.findByIdAndUpdate({_id:id},{status:true},{new:true});
            return res.status(201).send({
                sucess:true,
                msg:"task has been updated",
                data:updateStatus
            })
        }
    }



  }),
  removeUserTodo: AsyncerrorHandler(async (req, res, next) => {
    const {UserId}=req.body;
    const {id}=req.params;
    const isExist=await TodoModel.findOne({_id:id});
    if(!isExist){
        return next(new ErrorHandler(404,"todo does not exist"))
    }else{
        const checkAUthorization=await TodoModel.findOne({_id:id,UserId});
        if(!checkAUthorization){
        return next(new ErrorHandler(400,"you are not authorized to delete this task "))

        }else{
            const updateStatus=await TodoModel.findByIdAndDelete({_id:id},{status:true},{new:true});
            return res.status(201).send({
                sucess:true,
                msg:"task status has been deleted"
            })
        }
    }


  }),
};

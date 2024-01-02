const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema(
  {
    Task:{type:String,  required: [true, "Please Enter task Name"],},
    UserId:{type:mongoose.Types.ObjectId,ref:'user'},
    status:{type:Boolean,default:false}
  },
  {
    timestamps: true,
  }
);

const TodoModel = mongoose.model("todo", TodoSchema);

module.exports = {
  TodoModel,
};

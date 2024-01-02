const TodoRouter=require("express").Router();

const {createTodo,getAllTodo,UpdateUserTodoStatus,removeUserTodo} = require("../controller/Todo.controller");
const {Authentication}=require("../middleware/Authentication");


TodoRouter.route("/Todo").post(Authentication,createTodo).get(getAllTodo)
TodoRouter.route("/Todo/:id").patch(Authentication,UpdateUserTodoStatus).delete(Authentication,removeUserTodo);


module.exports={
    TodoRouter
}
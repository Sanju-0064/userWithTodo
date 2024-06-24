const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { ToDo, User, Role } = require("../models");

const verifyToken = (req, res, next) => {
  jwt.verify(
    req.headers["authorization"],
    `TvcM2W46Xdrdhdhasdhjasd345"[n,asdads^&78jhhf1E7kwHgY8Y^9Io8pgNfdLasd&^5tg`,
    async (err, decoded) => {
      if (err || !decoded || !decoded.sub) {
        return res.send({ success: false, message: "Unauthorized access." });
      }
      const user = await User.findOne({
        _id: decoded.sub,
        username: decoded.username,
      });

      if (!user) {
        return res.send({ success: false, message: "Unauthorized access." });
      }

      req._id = user["_id"];
      req.username = user["username"];
      req.roleId = decoded.roleId;
      next();
    }
  );
};

router.post("/api/create-todo", verifyToken, async (req, res) => {
  try {
    let { name } = req.body;
    let todo = new ToDo({ userId: req._id, name });
    let newTodo = await todo.save();
    res.send({
      success: true,
      response: newTodo,
      message: "ToDo created successfully.",
    });
  } catch (error) {
    res.send({ success: false, message: "An error occurred." });
  }
});

router.post("/api/update-todo", verifyToken, async (req, res) => {
  try {
    let { name, todoId } = req.body;

    let todo = await ToDo.findOne({ _id: todoId, userId: req._id }).exec();
    if (todo) {
      let updatedTodo = await ToDo.findByIdAndUpdate(
        todoId,
        { $set: { name: name } },
        { new: true }
      ).exec();

      if (!updatedTodo)
        res.send({ success: false, message: "An error occurred." });
      else
        res.send({
          success: true,
          response: updatedTodo,
          message: "ToDo successfully updated.",
        });
    } else {
      res.send({ success: false, message: "you cannot update this todo." });
    }
  } catch (error) {
    res.send({ success: false, message: "An error occurred." });
  }
});

router.get("/api/get-todo/:todoId", verifyToken, async (req, res) => {
  try {
    let todo = await ToDo.findOne({
      _id: req.params.todoId,
      userId: req._id,
    }).exec();
    if (todo) {
      res.send({
        success: true,
        response: todo,
        message: "ToDo successfully fetched.",
      });
    } else {
      res.send({ success: false, message: "ToDo not found" });
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "An error occurred." });
  }
});

router.post("/api/delete-todo/:todoId", verifyToken, async (req, res) => {
  try {
    let todo = await ToDo.findOne({
      _id: req.params.todoId,
      userId: req._id,
    }).exec();
    if (todo) {
      let deletedTodo = await ToDo.findByIdAndUpdate(req.params.todoId, {
        $set: { isDeleted: true },
      }).exec();
      res.send({
        success: true,
        response: deletedTodo,
        message: "ToDo successfully fetched.",
      });
    } else {
      res.send({ success: false, message: "ToDo not found" });
    }
  } catch (error) {
    res.send({ success: false, message: "An error occurred." });
  }
});

router.post("/api/get-all-todo", verifyToken, async (req, res) => {
  try {
    if (req.roleId == 0) {
      let todos = await ToDo.find().exec();
      res.send({
        success: true,
        message: "todos get successfully.",
        response: todos,
      });
    } else {
      let todos = await ToDo.find({ userId: req._id }).exec();
      res.send({
        success: true,
        message: "todos get successfully.",
        response: todos,
      });
    }
  } catch (error) {
    res.send({ success: false, message: "An error occurred." });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { User, Role } = require("../models");
const jwt = require("jsonwebtoken");

const signToken = (user, role) => {
  const payload = {
    sub: user._id,
    username: user.username,
    roleId: role.roleId,
    access: role.access,
  };
  return jwt.sign(
    payload,
    `TvcM2W46Xdrdhdhasdhjasd345"[n,asdads^&78jhhf1E7kwHgY8Y^9Io8pgNfdLasd&^5tg`
  );
};

router.post("/api/create-user", async (req, res) => {
  try {
    let { username, password, roleId } = req.body;
    let role = await Role.findOne({ roleId: roleId }).exec();
    let userAlreadyExist = await User.findOne({ username: username }).exec();
    if (userAlreadyExist) {
      return res.send({ success: false, message: "Username already exist." });
    }

    let user = new User({ username, password, roleId: role._id });

    let newUser = await user.save();

    res.send({
      success: true,
      response: newUser,
      message: "user successfully created.",
    });
  } catch (error) {
    res.send({ success: false, message: "An error occurred." });
  }
});

router.post("/api/update-user", async (req, res) => {
  try {
    let { userId, username } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { username: username } },
      { new: true }
    ).exec();

    if (!user) res.send({ success: false, message: "An error occurred." });
    else
      res.send({
        success: true,
        response: user,
        message: "User successfully updated",
      });
  } catch (error) {
    res.send({ success: false, message: "An error occurred." });
  }
});

router.post("/api/delete-user", async (req, res) => {
  try {
    let { userId } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { isDeleted: true } },
      { new: true }
    ).exec();

    if (!user) res.send({ success: false, message: "An error occurred." });
    else res.send({ success: true, message: "User successfully deleted" });
  } catch (error) {
    res.send({
      success: false,
      message: "An error occurred.",
    });
  }
});

router.get("/api/get-user/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId }).exec();
    if (!user) res.send({ success: false, message: "An error occurred." });
    else
      res.send({
        success: true,
        response: user,
        message: "User details successfully fetched",
      });
  } catch (error) {
    res.send({
      success: false,
      message: "An error occurred.",
    });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    let { username, password } = req.body;

    let user = await User.findOne({ username: username }).exec();
    if (user) {
      const isPasswordMatch = await user.comparePassword(password);
      if (isPasswordMatch) {
        const role = await Role.findOne({ _id: user.roleId }).exec();
        const jwtToken = signToken(user, role);
        const userJson = user.toJSON();

        ["password", "__v"].forEach((key) => delete userJson[key]);
        userJson.jwt = jwtToken;

        console.log("jwt", jwtToken, userJson);
        res.send({
          success: true,
          response: userJson,
          message: "Login success.",
        });
        // if (role.roleId == 0) {
        //   res.send({
        //     success: true,
        //     response: user,
        //     message: "Super admin login successfully.",
        //   });
        // } else {
        //   res.send({
        //     success: true,
        //     response: user,
        //     message: "User login successfully.",
        //   });
        // }
      } else {
        res.send({ success: false, message: "User not exist." });
      }
    } else {
      res.send({ success: false, message: "User not exist." });
    }
  } catch (error) {
    res.send({ success: false, message: "An error occurred." });
  }
});

module.exports = router;

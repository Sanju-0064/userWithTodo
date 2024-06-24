const express = require("express");
const router = express.Router();

router.use("/users",require("./user"))
router.use("/todo",require("./todo"))

module.exports = router
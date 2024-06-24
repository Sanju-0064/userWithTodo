const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: { type: String },
  access:{type:Array},
  roleId: {type:Number},
});

const Role = mongoose.model("role", roleSchema);

module.exports = Role;

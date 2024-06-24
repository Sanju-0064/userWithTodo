const mongoose = require("mongoose");
const { Schema } = mongoose; // Import Schema from mongoose
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: { type: String },
  password: { type: String },
  roleId: { type: Schema.Types.ObjectId, ref: "Role" },
  isDeleted: { type: Boolean, default: false },
});

// Hash the password before saving
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Add a method to the schema to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("user", userSchema);

module.exports = User;

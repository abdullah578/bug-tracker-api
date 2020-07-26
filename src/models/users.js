const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Invalid Email");
    },
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    trim: true,
    default: "N/A",
  },
  tokens: [
    {
      token: {
        required: true,
        _id: false,
        type: String,
      },
    },
  ],
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
      role: user.role,
      _id: user._id,
    },
    "Thisismybugtrackerpayloadsectret",
    { expiresIn: "1h" }
  );
  user.tokens.push({ token });
  await user.save();
  return token;
};
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await Users.findOne({ email });
  if (!user) throw new Error();
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error();
  return user;
};
userSchema.methods.getPublicProfile = function () {
  const user = { ...this.toObject() };
  delete user.password;
  delete user.tokens;
  delete user.__v;
  user.key = user._id;
  delete user._id;
  return user;
};
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 8);
  next();
});

const Users = mongoose.model("users", userSchema);
module.exports = Users;

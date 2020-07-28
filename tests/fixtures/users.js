const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userOneId = mongoose.Types.ObjectId();
const userTwoId = mongoose.Types.ObjectId();
const userThreeId = mongoose.Types.ObjectId();
const userFourId = mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "test admin",
  email: "test.admin@mail.com",
  password: "testtest",
  role: "Admin",
  tokens: [
    {
      token: jwt.sign(
        {
          name: "test admin",
          email: "test.admin@mail.com",
          role: "Admin",
          _id: userOneId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      ),
    },
  ],
};
const userTwo = {
  _id: userTwoId,
  name: "test project manager",
  email: "test.pm@mail.com",
  password: "testtest",
  role: "Project Manager",
  tokens: [
    {
      token: jwt.sign(
        {
          name: "test project manager",
          email: "test.pm@mail.com",
          role: "Project Manager",
          _id: userTwoId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      ),
    },
  ],
};
const userThree = {
  _id: userThreeId,
  name: "test submitter",
  email: "test.submitter@mail.com",
  password: "testtest",
  role: "Submitter",
  tokens: [
    {
      token: jwt.sign(
        {
          name: "test submitter",
          email: "test.submitter@mail.com",
          role: "Submitter",
          _id: userThreeId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      ),
    },
  ],
};
const userFour = {
  _id: userFourId,
  name: "test developer",
  email: "test.developer@mail.com",
  password: "testtest",
  role: "Developer",
  tokens: [
    {
      token: jwt.sign(
        {
          name: "test developer",
          email: "test.developer@mail.com",
          role: "Developer",
          _id: userFourId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      ),
    },
  ],
};

module.exports = {
  userOne,
  userTwo,
  userThree,
  userFour,
};

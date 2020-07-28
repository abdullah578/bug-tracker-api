const mongoose = require("mongoose");
const { userOneId, userTwoId, userThreeId, userFourId } = require("./users");
const projOneId = mongoose.Types.ObjectId();
const projTwoId = mongoose.Types.ObjectId();
const projThreeId = mongoose.Types.ObjectId();
const projectOne = {
  _id: projOneId,
  name: "My project 1",
  description: "project 1",
  users: [{ user: userOneId }, { user: userThreeId }, { user: userFourId }],
};
const projectTwo = {
  _id: projTwoId,
  name: "My project 2",
  description: "project 2",
  users: [{ user: userTwoId }, { user: userThreeId }, { user: userFourId }],
};
const projectThree = {
  _id: projThreeId,
  name: "My project 3",
  description: "project 3",
  users: [{ user: userOneId }, { user: userThreeId }, { user: userTwoId }],
};

module.exports = {
  projectOne,
  projectTwo,
  projectThree,
};

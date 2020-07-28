const User = require("../../src/models/users");
const Project = require("../../src/models/projects");
const { userOne, userTwo, userThree, userFour } = require("./users");
const { projectOne, projectTwo, projectThree } = require("./projects");

const setUpdb = async () => {
  await User.deleteMany();
  await Project.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new User(userThree).save();
  await new User(userFour).save();
  await new Project(projectOne).save();
  await new Project(projectTwo).save();
  await new Project(projectThree).save();
};

module.exports = setUpdb;

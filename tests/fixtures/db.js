const User = require("../../src/models/users");
const { userOne, userTwo, userThree, userFour } = require("./users");

const setUpdb = async () => {
  await User.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new User(userThree).save();
  await new User(userFour).save();
};

module.exports = setUpdb;

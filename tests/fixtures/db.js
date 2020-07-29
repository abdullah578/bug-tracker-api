const User = require("../../src/models/users");
const Project = require("../../src/models/projects");
const Ticket = require("../../src/models/tickets");
const { userOne, userTwo, userThree, userFour } = require("./users");
const { projectOne, projectTwo, projectThree } = require("./projects");
const {
  ticketOne,
  ticketTwo,
  ticketThree,
  ticketFour,
  ticketFive,
  ticketSix,
} = require("./tickets");
const setUpdb = async () => {
  await User.deleteMany();
  await Project.deleteMany();
  await Ticket.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new User(userThree).save();
  await new User(userFour).save();
  await new Project(projectOne).save();
  await new Project(projectTwo).save();
  await new Project(projectThree).save();
  await new Ticket(ticketOne).save();
  await new Ticket(ticketTwo).save();
  await new Ticket(ticketThree).save();
  await new Ticket(ticketFour).save();
  await new Ticket(ticketFive).save();
  await new Ticket(ticketSix).save();
};

module.exports = setUpdb;

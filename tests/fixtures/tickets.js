const mongoose = require("mongoose");
const { userOne, userTwo, userThree, userFour } = require("./users");
const { projectOne, projectTwo, projectThree } = require("./projects");
const ticketOneId = mongoose.Types.ObjectId();
const ticketTwoId = mongoose.Types.ObjectId();
const ticketThreeId = mongoose.Types.ObjectId();
const ticketFourId = mongoose.Types.ObjectId();
const ticketFiveId = mongoose.Types.ObjectId();
const ticketSixId = mongoose.Types.ObjectId();

const ticketOne = {
  _id: ticketOneId,
  title: "Ticket One",
  description: "This is ticket one",
  ticketPriority: "Low",
  ticketType: "Bugs/Errors",
  assigned: userFour.name,
  projName: projectOne.name,
  assignedEmail: userFour.email,
  submitter: userOne.name,
  submitterEmail: userOne.email,
  status: "Open",
  created: new Date(),
  projid: projectOne._id,
};
const ticketTwo = {
  _id: ticketTwoId,
  title: "Ticket Two",
  description: "This is ticket two",
  ticketPriority: "Medium",
  ticketType: "Bugs/Errors",
  assigned: userOne.name,
  projName: projectOne.name,
  assignedEmail: userOne.email,
  submitter: userThree.name,
  submitterEmail: userThree.email,
  status: "Open",
  created: new Date(),
  projid: projectOne._id,
};
const ticketThree = {
  _id: ticketThreeId,
  title: "Ticket Three",
  description: "This is ticket three",
  ticketPriority: "High",
  ticketType: "Bugs/Errors",
  assigned: userFour.name,
  projName: projectTwo.name,
  assignedEmail: userFour.email,
  submitter: userOne.name,
  submitterEmail: userOne.email,
  status: "Open",
  created: new Date(),
  projid: projectTwo._id,
};
const ticketFour = {
  _id: ticketFourId,
  title: "Ticket Four",
  description: "This is ticket four",
  ticketPriority: "None",
  ticketType: "Bugs/Errors",
  assigned: userFour.name,
  projName: projectTwo.name,
  assignedEmail: userFour.email,
  submitter: userThree.name,
  submitterEmail: userThree.email,
  status: "Open",
  created: new Date(),
  projid: projectTwo._id,
};
const ticketFive = {
  _id: ticketFiveId,
  title: "Ticket Five",
  description: "This is ticket five",
  ticketPriority: "Low",
  ticketType: "Feature Requests",
  assigned: userThree.name,
  projName: projectThree.name,
  assignedEmail: userThree.email,
  submitter: userTwo.name,
  submitterEmail: userTwo.email,
  status: "Open",
  created: new Date(),
  projid: projectThree._id,
};
const ticketSix = {
  _id: ticketSixId,
  title: "Ticket Six",
  description: "This is ticket six",
  ticketPriority: "Low",
  ticketType: "Bugs/Errors",
  assigned: userThree.name,
  projName: projectThree.name,
  assignedEmail: userThree.email,
  submitter: userOne.name,
  submitterEmail: userOne.email,
  status: "Open",
  created: new Date(),
  projid: projectThree._id,
};

module.exports = {
  ticketOne,
  ticketTwo,
  ticketThree,
  ticketFour,
  ticketFive,
  ticketSix,
};

const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const Project = require("../src/models/projects");
const setUpdb = require("./fixtures/db.js");
const { userOne, userTwo, userThree, userFour } = require("./fixtures/users");
const { projectOne, projectTwo, projectThree } = require("./fixtures/projects");
const {
  ticketOne,
  ticketTwo,
  ticketThree,
  ticketFour,
  ticketFive,
  ticketSix,
} = require("./fixtures/tickets");
const Tickets = require("../src/models/tickets");

beforeEach(setUpdb);

test("Should create ticket if admin or project manager or submittr", async () => {
  const test_id = mongoose.Types.ObjectId();
  const ticket = {
    _id: test_id,
    title: "Test Ticket",
    description: "This is test ticket",
    ticketPriority: "Low",
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
  await request(app)
    .post("/tickets")
    .set("auth", `Bearer ${userOne.tokens[0].token}`)
    .send(ticket)
    .expect(201);
  const fetch = await Tickets.findById(test_id);
  expect(fetch).not.toBeNull();
});

test("Should create ticket if admin or project manager or submittr", async () => {
  const test_id = mongoose.Types.ObjectId();
  const ticket = {
    _id: test_id,
    title: "Test Ticket",
    description: "This is test ticket",
    ticketPriority: "Low",
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
  await request(app)
    .post("/tickets")
    .set("auth", `Bearer ${userThree.tokens[0].token}`)
    .send(ticket)
    .expect(201);
  const fetch = await Tickets.findById(test_id);
  expect(fetch).not.toBeNull();
});
test("Should not create ticket if submiiter or assigned is invalid", async () => {
  const test_id = mongoose.Types.ObjectId();
  const ticket = {
    _id: test_id,
    title: "Test Ticket",
    description: "This is test ticket",
    ticketPriority: "Low",
    ticketType: "Bugs/Errors",
    assigned: userFour.name,
    projName: projectTwo.name,
    assignedEmail: userFour.email,
    submitter: userTwo.name,
    submitterEmail: userTwo.email,
    status: "Open",
    created: new Date(),
    projid: projectTwo._id,
  };
  await request(app)
    .post("/tickets")
    .set("auth", `Bearer ${userOne.tokens[0].token}`)
    .send(ticket)
    .expect(400);
  const ticket2 = {
    _id: test_id,
    title: "Test Ticket",
    description: "This is test ticket",
    ticketPriority: "Low",
    ticketType: "Bugs/Errors",
    assigned: userOne.name,
    projName: projectTwo.name,
    assignedEmail: userOne.email,
    submitter: userTwo.name,
    submitterEmail: userTwo.email,
    status: "Open",
    created: new Date(),
    projid: projectTwo._id,
  };
  await request(app)
    .post("/tickets")
    .set("auth", `Bearer ${userTwo.tokens[0].token}`)
    .send(ticket2)
    .expect(400);
  const ticket3 = {
    _id: test_id,
    title: "Test Ticket",
    description: "This is test ticket",
    ticketPriority: "Low",
    ticketType: "Bugs/Errors",
    assigned: userOne.name,
    projName: projectOne.name,
    assignedEmail: userOne.email,
    submitter: userTwo.name,
    submitterEmail: userTwo.email,
    status: "Open",
    created: new Date(),
    projid: projectOne._id,
  };
  await request(app)
    .post("/tickets")
    .set("auth", `Bearer ${userTwo.tokens[0].token}`)
    .send(ticket3)
    .expect(400);
  const fetch = await Tickets.findById(test_id);
  expect(fetch).toBeNull();
});
test("Should fetch all tickets if admin", async () => {
  const response = await request(app)
    .get("/tickets")
    .set("auth", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body).toHaveLength(6);
});

test("Should fetch all tickets assigned to project if project manager", async () => {
  const response = await request(app)
    .get("/tickets")
    .set("auth", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body).toHaveLength(4);
  const find1 = response.body.find(
    (curr) => curr.key.toString() === ticketThree._id.toString()
  );
  const find2 = response.body.find(
    (curr) => curr.key.toString() === ticketFour._id.toString()
  );
  const find3 = response.body.find(
    (curr) => curr.key.toString() === ticketFive._id.toString()
  );
  const find4 = response.body.find(
    (curr) => curr.key.toString() === ticketSix._id.toString()
  );
  if (!find1 || !find2 || !find3 || !find4) throw new Error();
});

test("Should fetch tickets assigned or submitted by you if submitter", async () => {
  const response = await request(app)
    .get("/tickets")
    .set("auth", `Bearer ${userThree.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body).toHaveLength(4);
  const find1 = response.body.find(
    (curr) => curr.key.toString() === ticketTwo._id.toString()
  );
  const find2 = response.body.find(
    (curr) => curr.key.toString() === ticketFour._id.toString()
  );
  const find3 = response.body.find(
    (curr) => curr.key.toString() === ticketFive._id.toString()
  );
  const find4 = response.body.find(
    (curr) => curr.key.toString() === ticketSix._id.toString()
  );
  if (!find1 || !find2 || !find3 || !find4) throw new Error();
});

test("Should fetch all project tickets if admin", async () => {
  const response = await request(app)
    .get(`/tickets/${projectThree._id}`)
    .set("auth", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body).toHaveLength(2);
});

test("Should fetch all project tickets if project manager", async () => {
  const response = await request(app)
    .get(`/tickets/${projectThree._id}`)
    .set("auth", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body).toHaveLength(2);
});
test("Should fetch user tickets for project if submtter or developer", async () => {
  const response = await request(app)
    .get(`/tickets/${projectOne._id}`)
    .set("auth", `Bearer ${userThree.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body).toHaveLength(1);
});
test("Should update ticket", async () => {
  const newTitle = "test";
  await request(app)
    .put(`/tickets/${ticketOne._id}`)
    .set("auth", `Bearer ${userThree.tokens[0].token}`)
    .send({
      title: newTitle,
    })
    .expect(200);
  const ticket = await Tickets.findById(ticketOne._id);
  expect(ticket.title).toBe(newTitle);
});
test("Should update allowed ticket properties if developer", async () => {
  const newStatus = "In Progress";
  await request(app)
    .put(`/tickets/${ticketOne._id}`)
    .set("auth", `Bearer ${userFour.tokens[0].token}`)
    .send({
      status: newStatus,
    })
    .expect(200);
  const ticket = await Tickets.findById(ticketOne._id);
  expect(ticket.status).toBe(newStatus);
});
test("Should not update disallowed ticket properties if developer", async () => {
  const newTitle = "test";
  await request(app)
    .put(`/tickets/${ticketOne._id}`)
    .set("auth", `Bearer ${userFour.tokens[0].token}`)
    .send({
      title: newTitle,
    })
    .expect(400);
  const ticket = await Tickets.findById(ticketOne._id);
  expect(ticket.title).toBe(ticketOne.title);
});
test("Should delete ticket if not develeper", async () => {
  await request(app)
    .delete(`/tickets/${ticketOne._id}`)
    .set("auth", `Bearer ${userThree.tokens[0].token}`)
    .send()
    .expect(200);
  const ticket = await Tickets.findById(ticketOne._id);
  expect(ticket).toBeNull();
});
test("Should not delete ticket if develeper", async () => {
  await request(app)
    .delete(`/tickets/${ticketOne._id}`)
    .set("auth", `Bearer ${userFour.tokens[0].token}`)
    .send()
    .expect(403);
  const ticket = await Tickets.findById(ticketOne._id);
  expect(ticket).not.toBeNull();
});

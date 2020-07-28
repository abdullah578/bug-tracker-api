const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const Project = require("../src/models/projects");
const setUpdb = require("./fixtures/db.js");
const { userOne, userTwo, userThree, userFour } = require("./fixtures/users");
const { projectOne, projectTwo, projectThree } = require("./fixtures/projects");

beforeEach(setUpdb);

test("Should add new project if admin", async () => {
  const id = mongoose.Types.ObjectId();
  const response = await request(app)
    .post("/projects")
    .set("auth", `Bearer ${userOne.tokens[0].token}`)
    .send({
      _id: id,
      name: "a",
      description: "d",
    })
    .expect(201);
  const project = await Project.findById(id);
  expect(project).not.toBeNull();
  expect(response.body.name).toBe(id.toHexString());
});

test("Should not add new project if not admin", async () => {
  const id = mongoose.Types.ObjectId();
  await request(app)
    .post("/projects")
    .set("auth", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      _id: id,
      name: "a",
      description: "d",
    })
    .expect(403);
  await request(app)
    .post("/projects")
    .set("auth", `Bearer ${userThree.tokens[0].token}`)
    .send({
      _id: id,
      name: "a",
      description: "d",
    })
    .expect(403);
  await request(app)
    .post("/projects")
    .set("auth", `Bearer ${userFour.tokens[0].token}`)
    .send({
      _id: id,
      name: "a",
      description: "d",
    })
    .expect(403);
  const project = await Project.findById(id);
  expect(project).toBeNull();
});

test("get all projects if admin", async () => {
  const response = await request(app)
    .get("/projects")
    .set("auth", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body).toHaveLength(3);
});

test("get user projects if not admin", async () => {
  const response = await request(app)
    .get("/projects")
    .set("auth", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body).toHaveLength(2);
});

test("Add users to projects if project manger", async () => {
  await request(app)
    .post(`/projects/${projectThree._id.toString()}/users`)
    .set("auth", `Bearer ${userTwo.tokens[0].token}`)
    .send({ userid: userFour._id })
    .expect(200);
  const project = await Project.findById(projectThree._id);
  expect(project.users).toHaveLength(4);
  const user = project.users.find(
    (curr) => curr.user.toString() === userFour._id.toString()
  );
  if (!user) throw new Error();
});
test("Add users to projects if admin", async () => {
  await request(app)
    .post(`/projects/${projectTwo._id.toString()}/users`)
    .set("auth", `Bearer ${userOne.tokens[0].token}`)
    .send({ userid: userOne._id })
    .expect(200);
  const project = await Project.findById(projectTwo._id);
  expect(project.users).toHaveLength(4);
  const user = project.users.find(
    (curr) => curr.user.toString() === userOne._id.toString()
  );
  if (!user) throw new Error();
});
test("Cannot add user to project if user already exists in project", async () => {
  await request(app)
    .post(`/projects/${projectThree._id.toString()}/users`)
    .set("auth", `Bearer ${userTwo.tokens[0].token}`)
    .send({ userid: userThree._id })
    .expect(400);
  const project = await Project.findById(projectThree._id);
  expect(project.users).toHaveLength(3);
});

test("Cannot add user to a project you are not part of", async () => {
  await request(app)
    .post(`/projects/${projectOne._id.toString()}/users`)
    .set("auth", `Bearer ${userTwo.tokens[0].token}`)
    .send({ userid: userTwo._id })
    .expect(400);
  const project = await Project.findById(projectOne._id);
  expect(project.users).toHaveLength(3);
});

test("Cannot add user to project if not admin or project manager", async () => {
  await request(app)
    .post(`/projects/${projectThree._id.toString()}/users`)
    .set("auth", `Bearer ${userThree.tokens[0].token}`)
    .send({ userid: userFour._id })
    .expect(403);
  const project = await Project.findById(projectThree._id);
  expect(project.users).toHaveLength(3);
});

test("Should get project users", async () => {
  const response = await request(app)
    .get(`/projects/${projectOne._id.toString()}/users`)
    .set("auth", `Bearer ${userFour.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body).toHaveLength(3);
  expect(response.body[0]).toHaveProperty("email");
});

test("Delete user from project if project manger", async () => {
  await request(app)
    .delete(
      `/projects/${projectThree._id.toString()}/${userThree._id.toString()}`
    )
    .set("auth", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);
  const project = await Project.findById(projectThree._id);
  expect(project.users).toHaveLength(2);
  const user = project.users.find(
    (curr) => curr.user.toString() === userThree._id.toString()
  );
  if (user) throw new Error();
});

test("Delete user from project if admin", async () => {
  await request(app)
    .delete(
      `/projects/${projectTwo._id.toString()}/${userThree._id.toString()}`
    )
    .set("auth", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const project = await Project.findById(projectTwo._id);
  expect(project.users).toHaveLength(2);
  const user = project.users.find(
    (curr) => curr.user.toString() === userThree._id.toString()
  );
  if (user) throw new Error();
});

test("Cannot delete user from  project you are not part of", async () => {
  await request(app)
    .delete(
      `/projects/${projectOne._id.toString()}/${userThree._id.toString()}`
    )
    .set("auth", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const project = await Project.findById(projectOne._id);
  expect(project.users).toHaveLength(3);
});

test("Cannot delete user from  project if not admin or project manager", async () => {
  await request(app)
    .delete(`/projects/${projectTwo._id.toString()}/${userFour._id.toString()}`)
    .set("auth", `Bearer ${userThree.tokens[0].token}`)
    .send()
    .expect(403);
  const project = await Project.findById(projectTwo._id);
  expect(project.users).toHaveLength(3);
});

test("Cannot delete user from  project if user does not exist", async () => {
  await request(app)
    .delete(
      `/projects/${projectThree._id.toString()}/${userFour._id.toString()}`
    )
    .set("auth", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const project = await Project.findById(projectTwo._id);
  expect(project.users).toHaveLength(3);
});

test("Delete project if admin", async () => {
  await request(app)
    .delete(`/projects/${projectOne._id}`)
    .set("auth", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const project = await Project.findById(projectOne._id);
  expect(project).toBeNull();
});

test("Cannot delete project if not admin", async () => {
    await request(app)
      .delete(`/projects/${projectTwo._id}`)
      .set("auth", `Bearer ${userTwo.tokens[0].token}`)
      .send()
      .expect(403);
    const project = await Project.findById(projectTwo._id);
    expect(project).not.toBeNull();
  });
  

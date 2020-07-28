const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/users");
const setUpdb = require("./fixtures/db.js");
const { userOne, userTwo, userThree } = require("./fixtures/users");

beforeEach(setUpdb);

test("Should sign up a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Abdullah Mohammed",
      email: "abdullah.am2000@gmail.com",
      password: "ajdjdjjndhh",
    })
    .expect(201);
  const user = await User.findById(response.body.localId);

  expect(user).not.toBeNull();
  expect(response.body).toMatchObject({
    localId: user._id.toString(),
    idToken: user.tokens[0].token,
  });
  expect(user.password).not.toBe("ajdjdjjndhh");
});

test("Should login an existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  const user = await User.findById(userOne._id);
  expect(response.body).toMatchObject({
    idToken: user.tokens[1].token,
    localId: user._id.toString(),
  });
  expect(user.password).not.toBe(userOne.password);
});

test("Should not login user with bad credentials", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "bsdjbjdsb",
    })
    .expect(400);
});

test("Should get list of users if admin or project manager", async () => {
  const response1 = await request(app)
    .get("/users")
    .set("auth", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const response2 = await request(app)
    .get("/users")
    .set("auth", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response1.body).toHaveLength(4);
  expect(response2.body).toHaveLength(4);
});

test("Should not get list of users if not admin or project manager", async () => {
  await request(app)
    .get("/users")
    .set("auth", `Bearer ${userThree.tokens[0].token}`)
    .send()
    .expect(403);
});

test("Should update user if admin", async () => {
  const newRole = "Developer";
  await request(app)
    .put("/users")
    .set("auth", `Bearer ${userOne.tokens[0].token}`)
    .send({ key: userThree._id, role: newRole })
    .expect(200);
  const user = await User.findById(userThree._id);
  expect(user.role).toBe(newRole);
});

test("Should not update user if not admin", async () => {
  const newRole = "Developer";
  await request(app)
    .put("/users")
    .set("auth", `Bearer ${userTwo.tokens[0].token}`)
    .send({ key: userThree._id, role: newRole })
    .expect(403);
});

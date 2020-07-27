const express = require("express");
const Users = require("../models/users");
const auth = require("../middleware/auth");
const { admin, role } = require("../middleware/role");

const router = new express.Router();

router.post("/", async (req, res) => {
  const user = new Users(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res
      .status(201)
      .send({ idToken: token, expiresIn: 3000, localId: user._id });
  } catch (err) {
    res.status(400).send({
      error: "Invalid email or password",
    });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ idToken: token, expiresIn: 3000 , localId: user._id});
  } catch (err) {
    res.status(400).send({ error: "Invalid email or password" });
  }
});
router.post("/logout", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = user.tokens.filter((curr) => curr.token !== req.token);
    await user.save();
    res.send();
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});
router.get("/", auth, role, async (req, res) => {
  try {
    const users = await Users.find({});
    const modified = users.map((curr) => {
      return curr.getPublicProfile();
    });
    res.send(modified);
  } catch (err) {
    res.status(500).send({ error: "An internal error occured" });
  }
});
router.put("/", auth, admin, async (req, res) => {
  const id = req.body.key;
  try {
    const user = await Users.findById(id);
    if (!user) throw new Error();
    user.role = req.body.role;
    await user.save();
    res.send();
  } catch (err) {
    res.status(404).send({ error: "User not found" });
  }
});
module.exports = router;

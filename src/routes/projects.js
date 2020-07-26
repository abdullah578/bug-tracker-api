const express = require("express");
const Project = require("../models/projects");
const auth = require("../middleware/auth");
const { admin, role, role3 } = require("../middleware/role");

const router = new express.Router();

router.post("/", auth, admin, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).send();
  } catch (err) {
    res.status(400).send({ error: "Failed to save project" });
  }
});

router.get("/", auth, role3, async (req, res) => {
  try {
    let projects;
    if (req.user.role === "Admin") {
      projects = await Project.find({});
    } else {
      projects = await Project.find({ "users.user": req.user._id });
    }
    const modified = projects.map((curr) => curr.getPublicProfile());
    res.send(modified);
  } catch (ex) {
    res.status(500).send({ error: "An internal server error occured" });
  }
});

router.post("/:id/users", auth, role, async (req, res) => {
  const projid = req.params.id;
  const userid = req.body.userid;
  try {
    const project = await Project.findById(projid);
    project.users.push({ user: userid });
    await project.save();
    res.send();
  } catch (ex) {
    res.status(400).send({ error: "Unable to save user" });
  }
});

router.get("/:id/users", auth, role3, async (req, res) => {
  const projid = req.params.id;
  try {
    const project = await Project.findById(projid);
    if (!project.users.length) return res.send([]);
    await project.populate("users.user").execPopulate();
    const users = project.users.map((curr) => curr.user.getPublicProfile());
    res.send(users);
  } catch (ex) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;


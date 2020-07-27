const express = require("express");
const Project = require("../models/projects");
const Ticket = require("../models/tickets");
const User = require("../models/users");
const auth = require("../middleware/auth");
const { admin, role, role3 } = require("../middleware/role");
const Tickets = require("../models/tickets");

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

router.delete("/:id", auth, admin, async (req, res) => {
  const projid = req.params.id;
  console.log("h");
  try {
    let tickets = await Tickets.find({ projid });
    tickets = tickets.map((curr) => curr._id.toString());
    await Ticket.deleteMany({ projid });
    await Project.deleteOne({ _id: projid });
    res.send(tickets);
  } catch (ex) {
    res.status(404).send({ error: "Project not found" });
  }
});

router.delete("/:id/:userid", auth, role, async (req, res) => {
  const { id, userid } = req.params;
  try {
    const user = await User.findById(userid);
    let tickets = await Ticket.find({
      $or: [{ assignedEmail: user.email }, { submitterEmail: user.email }],
      projid: id,
    });
    tickets = tickets.map((curr) => curr._id.toString());
    await Ticket.deleteMany({
      $or: [{ assignedEmail: user.email }, { submitterEmail: user.email }],
      projid: id,
    });
    const project = await Project.findById(id);
    project.users = project.users.filter(
      (curr) => curr.user.toString() !== userid
    );
    await project.save();
    res.send(tickets);
  } catch (err) {
    res.status(404).send({ error: "Not found" });
  }
});



module.exports = router;

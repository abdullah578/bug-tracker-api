const express = require("express");
const Project = require("../models/projects");
const Ticket = require("../models/tickets");
const User = require("../models/users");
const auth = require("../middleware/auth");
const { admin, role, role3 } = require("../middleware/role");
const Tickets = require("../models/tickets");

const router = new express.Router();
//Create a new project(if admin)
router.post("/", auth, admin, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).send({ name: project._id });
  } catch (err) {
    res.status(400).send({ error: "Failed to save project" });
  }
});
/*
get projects for the user
Admins get all projects in the database
Rest of the users get projects assigned to them
Sends a list of the projects in descending order of date created
*/
router.get("/", auth, role3, async (req, res) => {
  try {
    let projects;
    if (req.user.role === "Admin") {
      projects = await Project.find({});
    } else {
      projects = await Project.find({ "users.user": req.user._id });
    }
    const modified = projects.map((curr) => curr.getPublicProfile()).reverse();
    res.send(modified);
  } catch (ex) {
    res.status(500).send({ error: "An internal server error occured" });
  }
});
/*
add users to projects if admin or project manager
admins can add users to any project
project managers can add users to the projects assigned to them
*/
router.post("/:id/users", auth, role, async (req, res) => {
  const projid = req.params.id;
  const userid = req.body.userid;
  try {
    const project =
      req.user.role === "Admin"
        ? await Project.findById(projid)
        : await Project.findOne({ _id: projid, "users.user": req.user._id });

    if (!project) throw new Error();
    const find = project.users.find((curr) => curr.user.toString() === userid);
    if (find) throw new Error();
    project.users.push({ user: userid });
    await project.save();
    res.send();
  } catch (ex) {
    res.status(400).send({ error: "Unable to save user" });
  }
});

/**
 * Returns a list of users for a project given by id
 */
router.get("/:id/users", auth, role3, async (req, res) => {
  const projid = req.params.id;
  try {
    const project = await Project.findById(projid);
    if (!project.users.length) return res.send([]);
    await project.populate("users.user").execPopulate();
    const users = project.users.map((curr) => curr.user.getPublicProfile());
    res.send(users);
  } catch (ex) {
    res.status(404).send("Project not found");
  }
});

/*
Delete a project given by id if admin
Delete all tickets associated with the project
Sends a list of the deleted tickets
*/ 
router.delete("/:id", auth, admin, async (req, res) => {
  const projid = req.params.id;
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

/**
 * Delete a user from a project if admin or project manager
 * Admins can delete users from any project
 * Project managers can delete users from projects assigned to them
 * Delete all tickets assigned to the user for the project
 * Sends a list of the deleted tickets
 */

router.delete("/:id/:userid", auth, role, async (req, res) => {
  const { id, userid } = req.params;
  try {
    const user = await User.findById(userid);
    const project =
      req.user.role === "Admin"
        ? await Project.findById(id)
        : await Project.findOne({ _id: id, "users.user": req.user._id });
    if (!project) throw new Error();
    const userIndex = project.users.findIndex(
      (curr) => curr.user.toString() === userid
    );
    if (userIndex === -1) throw new Error();
    project.users.splice(userIndex, 1);
    await project.save();
    let tickets = await Ticket.find({
      assignedEmail: user.email,
      projid: id,
    });
    tickets = tickets.map((curr) => curr._id.toString());
    await Ticket.deleteMany({
      assignedEmail: user.email,
      projid: id,
    });
    res.send(tickets);
  } catch (err) {
    res.status(404).send({ error: "Not found" });
  }
});

module.exports = router;

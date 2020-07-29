const express = require("express");
const Project = require("../models/projects");
const Ticket = require("../models/tickets");
const User = require("../models/users");
const auth = require("../middleware/auth");
const { role2, role3 } = require("../middleware/role");
const router = new express.Router();

/**
 * Create a new ticket for a project
 * Both submitter and assigned users must be part of the project
 * Admin need not be part of the project to be a submitter
 */
router.post("/", auth, role2, async (req, res) => {
  try {
    const project = await Project.findById(req.body.projid).populate(
      "users.user"
    );
    const submitter = await User.findOne({ email: req.body.submitterEmail });
    const submitterFound =
      submitter.role === "Admin" ||
      project.users.find((curr) => curr.user.email === req.body.submitterEmail);
    const assignedFound = project.users.find(
      (curr) => curr.user.email === req.body.assignedEmail
    );
    if (!submitterFound || !assignedFound || submitter.email !== req.user.email)
      throw new Error();
    const ticket = new Ticket(req.body);
    await ticket.save();
    res.status(201).send({ name: ticket._id });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

/**
 * Update a ticket
 * Developer can only update the ticket status and add comments
 * All other users can update any of the ticket properties
 */
router.put("/:id", auth, role3, async (req, res) => {
  try {
    const allowedProperties = ["status", "comments", "history"];
    const isValid = Object.keys(req.body).every((prop) =>
      allowedProperties.includes(prop)
    );
    if (req.user.role === "Developer" && !isValid) throw new Error();
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    res.send(ticket);
  } catch (err) {
    res.status(400).send({ error: "Bad request" });
  }
});
/**
 * Fetch all the user tickets
 * Fetch all tickets if admin
 * Fetch all project tickets if project manager
 * Fetch tickets submited or assigned to you if submitter or developer
 */
router.get("/", auth, role3, async (req, res) => {
  try {
    let tickets = [];
    if (req.user.role === "Admin") tickets = await Ticket.find({});
    else if (req.user.role === "Project Manager") {
      const projects = await Project.find({ "users.user": req.user._id });
      await Promise.all(
        projects.map(async (curr) => {
          const projTickets = await Ticket.find({ projid: curr._id });
          tickets = tickets.concat(projTickets);
        })
      );
    } else {
      tickets = await Ticket.find({
        $or: [
          { assignedEmail: req.user.email },
          { submitterEmail: req.user.email },
        ],
      });
    }
    tickets = tickets.map((curr) => curr.getPublicProfile()).reverse();
    res.send(tickets);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});
/**
 * Fetch tickets for a project
 */
router.get("/:projid", auth, role3, async (req, res) => {
  try {
    let tickets = [];
    if (req.user.role === "Admin" || req.user.role === "Project Manager") {
      tickets = await Ticket.find({ projid: req.params.projid });
    } else {
      tickets = await Ticket.find({
        $or: [
          { assignedEmail: req.user.email },
          { submitterEmail: req.user.email },
        ],
        projid: req.params.projid,
      });
    }
    tickets = tickets.map((curr) => curr.getPublicProfile()).reverse();
    res.send(tickets);
  } catch (err) {
    res.status(500).send({ error: "An internal server error occured" });
  }
});
/**
 * Delete a ticket given by id
 */
router.delete("/:id", auth, role2, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new Error();
    await ticket.remove();
    res.send();
  } catch (err) {
    res.status(404).send({ error: "Ticket not found" });
  }
});
module.exports = router;

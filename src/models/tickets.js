const mongoose = require("mongoose");
const validator = require("validator");

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ticketPriority: {
    type: String,
    required: true,
    validate(value) {
      if (
        value !== "None" &&
        value !== "Low" &&
        value !== "Medium" &&
        value !== "High"
      )
        throw new Error("Invalid priority type");
    },
  },
  ticketType: {
    type: String,
    required: true,
    validate(value) {
      if (value !== "Bugs/Errors" && value !== "Feature Requests")
        throw new Error("Invalide type");
    },
  },
  assigned: {
    type: String,
    required: true,
  },
  assignedEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Invalid email");
    },
  },
  submitter: {
    type: String,
    required: true,
  },
  submitterEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Invalid email");
    },
  },
  projid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  projName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    validate(value) {
      if (
        value !== "Open" &&
        value !== "In Progress" &&
        value !== "Resolved" &&
        value !== "Additional Info Required"
      )
        throw new Error("Invalid status type");
    },
  },
  created: {
    type: String,
    required: true,
  },
  comments: [
    {
      _id: false,
      date: {
        type: Date,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
  ],
  history: [
    {
      _id: false,
      date: {
        type: Date,
        required: true,
      },
      newVal: {
        type: String,
        required: true,
      },
      oldVal: {
        type: String,
        required: true,
      },
      property: {
        type: String,
        required: true,
      },
    },
  ],
});
ticketSchema.methods.getPublicProfile = function () {
  const ticket = { ...this.toObject() };
  ticket.key = ticket._id;
  delete ticket._id;
  return ticket;
};
const Tickets = mongoose.model("tickets", ticketSchema);

module.exports = Tickets;

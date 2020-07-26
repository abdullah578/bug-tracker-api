const mongoose = require("mongoose");

const projSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  users: [
    {
      user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    },
  ],
});

projSchema.methods.getPublicProfile = function () {
  const proj = { ...this.toObject() };
  delete proj.users;
  delete proj.__v;
  proj.key = proj._id;
  delete proj._id;
  return proj;
};

const Projects = mongoose.model("projects", projSchema);

module.exports = Projects;

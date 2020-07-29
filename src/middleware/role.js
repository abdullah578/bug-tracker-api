/**
 * There are 4 roles each user can have
 * Admin
 * Project Manager
 * Submitter
 * Developer
 * 
 * Thid middleware prevents certain users from accessing routes based on their role
 */
const role = async (req, res, next) => {
  if (req.user.role === "Admin" || req.user.role === "Project Manager") {
    next();
  } else {
    res.status(403).send({ error: "Permission denied" });
  }
};

const role2 = async (req, res, next) => {
  if (
    req.user.role === "Admin" ||
    req.user.role === "Project Manager" ||
    req.user.role === "Submitter"
  ) {
    next();
  } else {
    res.status(403).send({ error: "Permission denied" });
  }
};
const role3 = async (req, res, next) => {
  if (
    req.user.role === "Admin" ||
    req.user.role === "Project Manager" ||
    req.user.role === "Submitter" ||
    req.user.role == "Developer"
  ) {
    next();
  } else {
    res.status(403).send({ error: "Permission denied" });
  }
};
const admin = async (req, res, next) => {
  if (req.user.role === "Admin") {
    next();
  } else {
    res.status(403).send({ error: "Permission denied" });
  }
};

module.exports = {
  admin,
  role,
  role2,
  role3,
};

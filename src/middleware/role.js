const role = async (req, res, next) => {
  if (req.user.role === "Admin" || req.user.role === "Project Manager") {
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
};

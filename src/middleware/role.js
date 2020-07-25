const role = async (req, res, next) => {
  if (req.user.role === "Admin" || req.user.role === "Project Manager") {
    next();
  } else {
    res.status(401).send({ error: "Permission denied" });
  }
};

module.exports = role;

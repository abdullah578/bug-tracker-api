const jwt = require("jsonwebtoken");
const Users = require("../models/users");
/**
 * This middlewware allows user to access routes only if they are authentciated
 */
const auth = async (req, res, next) => {
  try {
    const token = req.header("auth").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findOne({
      _id: decode._id,
      "tokens.token": token,
    });
    if (!user) throw new Error();
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send({ error: err });
  }
};
module.exports = auth;

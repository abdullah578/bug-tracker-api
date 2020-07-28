
const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/users");
const projRouter = require("./routes/projects");
const ticketRouter = require("./routes/tickets");
require("./db/mongoose");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use("/projects", projRouter);
app.use("/tickets", ticketRouter);

module.exports = app;


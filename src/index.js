const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/users");
const projRouter = require("./routes/projects");
require("./db/mongoose");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use("/projects", projRouter);

app.listen(3000, () => {
  console.log("Server is up and running on port 3000");
});

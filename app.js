const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();

require("./config/session.config")(app);
require("dotenv/config");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const authRouter = require("./routes/auth.route");
app.use("/auth", authRouter);

const toolsRouter = require("./routes/tools.route");
app.use("/tools", toolsRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

require("./error-handling")(app);

module.exports = app;

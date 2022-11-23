const express  = require("hbs");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();

require("./config/session.config")(app);
require("dotenv/config");

app.set("views",path.join(__dirname, "views"));
app.set("view engine","hbs")


const router = require("express").Router();

const User = require("../models/user.model");
const mongoose = require("mongoose");
const { isAnon, isLoggedIn } = require("../middlewares/auth.middlewares");

router.get("/creator-tools", isLoggedIn, (req, res, next) => {
  res.render("tools/creator-tools", { userInSession: req.session.currentUser });
});

router.get("/admin-tools", isLoggedIn, (req, res, next) => {
  res.render("tools/admin-tools", { userInSession: req.session.currentUser });
});

module.exports = router;

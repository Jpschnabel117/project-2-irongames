const router = require("express").Router();

const User = require("../models/user.model");
const mongoose = require("mongoose");
const { isAnon, isLoggedIn } = require("../middlewares/auth.middlewares");
const Game = require("../models/game.model");
const Review = require("../models/review.model");

router.get("/creator-tools", isLoggedIn, (req, res, next) => {
  Game.find({ owner: req.session.currentUser._id })
    .populate('owner')
    .then((myGames) => {
      console.log(myGames);
      res.render("tools/creator-tools", {
        userInSession: req.session.currentUser,
        myGames,
      });
    });
});

router.get("/admin-tools", isLoggedIn, (req, res, next) => {
  res.render("tools/admin-tools", { userInSession: req.session.currentUser });
});

module.exports = router;

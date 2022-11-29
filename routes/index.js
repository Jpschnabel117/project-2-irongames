var express = require("express");
const mongoose = require("mongoose");
const Game = require("../models/game.model");
const Review = require("../models/review.model");
const User = require("../models/user.model");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  Game.find()
    .populate("owner")
    .then((allGames) => {
      res.render("index", {
        userInSession: req.session.currentUser,
        allGames,
      });
    });
});

module.exports = router;

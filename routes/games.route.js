const router = require("express").Router();

const User = require("../models/user.model");
const mongoose = require("mongoose");
const {
  isAdmin,
  isAnon,
  isLoggedIn,
  isNotOwner,
  isOwner,
} = require("../middlewares/auth.middlewares");
const Game = require("../models/game.model");

router.post("/creategame", isLoggedIn, (req, res, next) => {
  if (!req.body.title || !req.body.description || !req.body.gitPage) {
    if (req.session.currentUser.admin) {
      res.render("tools/admin-tools", {
        errorMessage:
          "Posts must have a minimum of Title, description, and gitPage",
        userInSession: req.session.currentUser,
      });
      return;
    } else {
      res.render("tools/creator-tools", {
        errorMessage:
          "Posts must have a minimum of Title, description, and gitPage",
        userInSession: req.session.currentUser,
      });
      return;
    }
  }
  Game.findOne({ title: req.body.title })
    .then(() => {
      return Game.create({
        title: req.body.title,
        description: req.body.description,
        techDescription: req.body.techDescription,
        imageUrl: req.body.imageUrl,
        gitPage: req.body.gitPage,
        gitRep: req.body.gitRep,
        pending: true,
        owner: req.session.currentUser._id, //session username
      });
    })
    .then((createdGame) => {
      console.log("created game: ", createdGame);
      req.session.currentGame = createdGame;
      req.session.currentUser.ownedGames.push(createdGame);
      req.session.currentUser.pendingGames.push(createdGame);
      if (req.session.currentUser.admin) {
        res.redirect("/tools/admin-tools");
      } else {
        res.redirect("/tools/creator-tools");
      }
    }) //fix username repeat error
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        if (req.session.currentUser.admin) {
          res.status(500).render("tools/admin-tools", {
            errorMessage: err.message,
            userInSession: req.session.currentUser,
          });
        } else {
          res.status(500).render("tools/creator-tools", {
            errorMessage: err.message,
            userInSession: req.session.currentUser,
          });
        }
      } else if (err.code === 11000) {
        if (req.session.currentUser.admin) {
          res.status(500).render("tools/admin-tools", {
            errorMessage: "title needs to be unique. title is already used.",
            userInSession: req.session.currentUser,
          });
        } else {
          res.status(500).render("tools/creator-tools", {
            errorMessage: "title needs to be unique. title is already used.",
            userInSession: req.session.currentUser,
          });
        }
      } else {
        next(err);
      }
    });
});

module.exports = router;

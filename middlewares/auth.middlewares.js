const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/");
    return;
  }
  next();
};

const isAnon = (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("/auth/userProfile");
    return;
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.session.currentUser.admin) {
    return true;
  } else {
    return false;
  }
};

const Game = require("../models/game.model");
//isowner middleware
const isOwner = (req, res, next) => {
  Game.findById(req.params.id)
    .then((foundGame) => {
      if (String(foundGame.owner) === req.session.user._id) {
        next();
      } else {
        //pop up model
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const isNotOwner = (req, res, next) => {
  Game.findById(req.params.id)
    .then((foundGame) => {
      if (String(foundGame.owner) !== req.session.user._id) {
        next();
      } else {
        //pop up model
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  isAdmin,
  isNotOwner,
  isOwner,
  isLoggedIn,
  isAnon,
};

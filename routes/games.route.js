const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
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

router.post(
  "/creategame",
  isLoggedIn,
  fileUploader.single("gameImgFile"),
  (req, res, next) => {
    if (!req.body.title || !req.body.description || !req.body.gitPage) {
      //find
      Game.find({ owner: req.session.currentUser._id })
        .populate("owner")
        .then((myGames) => {
          if (req.session.currentUser.admin) {
            res.render("tools/admin-tools", {
              errorMessage:
                "Posts must have a minimum of Title, description, and gitPage",
              userInSession: req.session.currentUser,
              myGames,
            });
          } else {
            res.render("tools/creator-tools", {
              errorMessage:
                "Posts must have a minimum of Title, description, and gitPage",
              userInSession: req.session.currentUser,
              myGames,
            });
          }
          return;
        });
      return;
    }
    Game.findOne({ title: req.body.title })
      .then(() => {
        return Game.create({
          title: req.body.title,
          description: req.body.description,
          techDescription: req.body.techDescription,
          imageUrl: req.file.path,
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
          //find
          Game.find({ owner: req.session.currentUser._id })
            .populate("owner")
            .then((myGames) => {
              if (req.session.currentUser.admin) {
                res.status(500).render("tools/admin-tools", {
                  errorMessage: err.message,
                  userInSession: req.session.currentUser,
                  myGames,
                });
              } else {
                res.status(500).render("tools/creator-tools", {
                  errorMessage: err.message,
                  userInSession: req.session.currentUser,
                  myGames,
                });
              }
            });
          return;
        } else if (err.code === 11000) {
          Game.find({ owner: req.session.currentUser._id })
            .populate("owner")
            .then((myGames) => {
              if (req.session.currentUser.admin) {
                res.status(500).render("tools/admin-tools", {
                  errorMessage:
                    "title needs to be unique. title is already used.",
                  userInSession: req.session.currentUser,
                  myGames,
                });
              } else {
                res.status(500).render("tools/creator-tools", {
                  errorMessage:
                    "title needs to be unique. title is already used.",
                  userInSession: req.session.currentUser,
                  myGames,
                });
              }
            });
          return;
        } else {
          next(err);
        }
      });
  }
);

router.get("/:title/editgame", (req, res, next) => {
  Game.find({ title: req.params.title })
    .then((foundGame) => {
      console.log(foundGame, "FOUND GAME");
      res.render("game/game-edit", foundGame[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/:title/editgame", (req, res, next) => {
  Game.findOneAndUpdate(
    { title: req.params.title },
    req.body /*the form stuff*/,
    { new: true }
  )
    .then((foundGame) => {
      console.log(foundGame, "updated Game");
      //add redirect for admin tools with admin check
      res.redirect("/tools/creator-tools");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/:id/delete", (req, res, next) => {
  console.log(req.params.id, "PARAMS NAME");
  Game.findByIdAndDelete(req.params.id)
    .then((foundGame) => {
      res.redirect("/tools/creator-tools");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/:id/approvegame", (req, res, next) => {
  console.log(req.params.id, "PARAMS NAME");
  Game.findByIdAndUpdate(req.params.id, { pending: false })
    .then((foundGame) => {
      res.redirect("/tools/admin-tools");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

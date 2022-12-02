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
const Review = require("../models/review.model");
const { update } = require("../models/user.model");

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
    // let img = "";
    // if (req.file !== undefined) {
    //   img = req.file.path;
    // }
    Game.findOne({ title: req.body.title })
      .then(() => {
        return Game.create({
          title: req.body.title,
          description: req.body.description,
          techDescription: req.body.techDescription,
          imageUrl: req.file?.path,
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

router.post(
  "/:title/editgame",
  fileUploader.single("gameImgFile"),
  (req, res, next) => {
    if (!req.body.title || !req.body.description || !req.body.gitPage) {
      Game.find({ title: req.params.title })
        .then((foundGame) => {
          console.log(foundGame, "FOUND GAME");
          res.render("game/game-edit", foundGame[0]);
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
    Game.findOneAndUpdate(
      { title: req.params.title },
      {
        pending: true,
        title: req.body.title,
        gitPage: req.body.gitPage,
        gitRep: req.body.gitRep,
        description: req.body.description,
        techDescription: req.body.techDescription,
        imageUrl: req.file?.path,
      },
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
  }
);

router.post("/:id/delete", (req, res, next) => {
  console.log(req.params.id, "PARAMS NAME");
  Game.findByIdAndDelete(req.params.id)
    .then((foundGame) => {
      if (req.session.currentUser.admin) {
        res.redirect("/tools/admin-tools");
      } else {
        res.redirect("/tools/creator-tools");
      }
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

router.get("/:title/gameDetails", (req, res, next) => {
  Game.find({ title: req.params.title })
    .populate({ path: "reviews", populate: { path: "user" } })
    .populate("owner")
    .then((foundGame) => {
      let dateMADE = foundGame[0].createdAt.toString().substring(0, 10);
      console.log(foundGame, "FOUND GAME");
      res.render("game/game-details", {
        foundGame: foundGame[0],
        userInSession: req.session.currentUser,
        dateMade: dateMADE,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/:title/reviewGame", (req, res, next) => {
  let notReviewed = true;
  req.session.currentUser.gamesRated.forEach((game) => {
    //review check
    if (game === req.params.title) {
      notReviewed = false;
    }
  });
  if (notReviewed === true && req.body.score <= 10 && req.body.score > 0) {
    Review.create({
      user: req.session.currentUser._id,
      rating: req.body.score,
      comment: req.body.comment,
    })
      .then((newReview) => {
        return Game.findOneAndUpdate(
          { title: req.params.title },
          { $addToSet: { reviews: newReview._id } },
          { new: true }
        ).populate("reviews");
      })
      .then((updatedGame) => {
        //add to reviewed games
        req.session.currentUser.gamesRated.push(updatedGame.title);

        let total = 0;
        console.log("sadasda", updatedGame.reviews);
        updatedGame.reviews.forEach((element) => {
          total = Number(element.rating) + total;
        });
        console.log(total);
        let average = Math.round(
          ((total / updatedGame.reviews.length) * 10) / 10
        );

        updatedGame.rating = Number(average); // use .save somehow
        updatedGame.save().then(() => {
          res.redirect(`/game/${updatedGame.title}/gameDetails`);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log("already reviewd");
    Game.find({ title: req.params.title })
      .populate({ path: "reviews", populate: { path: "user" } })
      .populate("owner")
      .then((foundGame) => {
        let message = "Your score should be 1-10";
        if (notReviewed === false) {
          message = "youve already reviewed this game";
        }
        console.log(foundGame, "FOUND GAME");
        res.render("game/game-details", {
          foundGame: foundGame[0],
          userInSession: req.session.currentUser,
          errorMessage: message,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

module.exports = router;

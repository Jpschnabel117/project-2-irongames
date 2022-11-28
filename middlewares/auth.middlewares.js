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

// const Room = require("../models/room.model");
// //isowner middleware
// const isOwner = (req, res, next) => {
//   Room.findById(req.params.id)
//     .then((foundRoom) => {
//       if (String(foundRoom.owner) === req.session.user._id) {
//         next();
//       } else {
//         //pop up model
//         res.redirect("/rooms/rooms-list");
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// const isNotOwner = (req, res, next) => {
//   Room.findById(req.params.id)
//     .then((foundRoom) => {
//       if (String(foundRoom.owner) !== req.session.user._id) {
//         next();
//       } else {
//         //pop up model
//         res.redirect("/rooms/rooms-list");
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

module.exports = {
  //isNotOwner,
  //isOwner,
  isLoggedIn,
  isAnon,
};

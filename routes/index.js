var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    userInSession: req.session.currentUser,
  });
});

module.exports = router;

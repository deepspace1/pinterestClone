var express = require("express");
const userModel = require("../models/user.model");
const passport = require("passport");
var router = express.Router();
const localStrategy = require("passport-local").Strategy;
const upload = require("./multer");
const postUpload = require("./multer2");
const postModel = require("../models/post.model");

passport.use(new localStrategy(userModel.authenticate()));

router.get("/", function (req, res, next) {
  res.render("index", { nav: true });
});

router.get("/profile", isLoggedIn, async function (req, res, next) {
  const loggedUser = await userModel
    .findOne({
      username: req.session.passport.user,
    })
    .populate("posts");
  res.render("profile", { nav: true, buttonText: "Logout", user: loggedUser });
});

router.get("/allPosts", isLoggedIn, async function (req, res, next) {
  const user = await userModel
    .findOne({
      username: req.session.passport.user,
    })
    .populate("posts");
  console.log(user);
  res.render("allPosts", { nav: true, buttonText: "Logout", user: user });
});

router.get('/feed', async function(req, res, next){
  const post = await postModel.find();
  res.render("feed", {post:post, nav:true, buttonText: "Logout"}); 
})

router.get("/register", function (req, res, next) {
  res.render("register", { nav: false });
});

router.post("/register", function (req, res, next) {
  const newUser = new userModel({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  });
  userModel.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.error(err);
      return next(err);
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.get("/login", function (req, res, next) {
  res.render("login", { nav: false });
});

router.get("/createPost", isLoggedIn, function (req, res, next) {
  res.render("createPost", { nav: false });
});

router.post(
  "/uploadDp",
  isLoggedIn,
  upload.single("file"),
  async function (req, res, next) {
    console.log(req.session);
    const updateUser = await userModel.findOne({
      username: req.session.passport.user,
    });

    updateUser.dp = req.file.filename;
    await updateUser.save();
    console.log(updateUser);
    res.redirect("/profile");
  }
);

router.post(
  "/createPost",
  isLoggedIn,
  postUpload.single("file"),
  async function (req, res, next) {
    console.log(req.session);
    const user = await userModel
      .findOne({
        username: req.session.passport.user,
      })
      .populate("posts");
    console.log(user);
    const post = await postModel.create({
      caption: req.body.caption,
      postImage: req.file.filename,
      user: user._id,
    });

    user.posts.push(post._id);
    await user.save();

    res.redirect("/profile");
  }
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  function () {}
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;

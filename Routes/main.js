const express = require("express");
// good video on router and MVC (thanks Wolfie!) https://www.youtube.com/watch?v=zW_tZR0Ir3Q&list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU&index=12&ab_channel=TheNetNinja
const router = express.Router();
// This is where we will be requiring the User and ensureAuth, so I don't believe we'll need it in the server anymore? (VKB)
const User = require("../models/User");
const PizzaPost = require("../models/Post");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const passport = require("passport");

// Changed the from app.get to router.get etc. since we want router used within the app
//Home Page
router.get("/", (req, res) => {
  res.render("index", { user: req.user, title: 'Home', style: 'index', feed: false });
});

//Login Page
router.get("/login", ensureGuest, (req, res) => {
  res.render("login", { user: req.user, title: 'Login', style: 'login', feed: false });
});

//Changing the callback to async because we are sending a request to the DB now
router.get("/profile", ensureAuth, async (req, res) => {
  await PizzaPost.find({ user: req.user.id }).then((response) => {
    res.render("profile", { user: req.user, posts: response,
    title: 'Profile',
    style: 'feed', feed: true });
  });
});

router.get("/feed", async (req, res) => {
  await PizzaPost.find().then((response) => {
    res.render("feed", {
      user: req.user,
      posts: response,
      title: 'Feed',
      style: 'feed',
      feed: true,
    });
  });
});


//Signup Page
router.get("/signup", ensureGuest, (req, res) => {
  res.render("signup",  {
      user: req.user,
      title: 'Sign Up',
      style: 'login',
      feed: false,
    });
});

//Sign up new user POST request
router.post("/create-user", (req, res) => {
  const user = new User(req.body);
  user.save().then((result) => console.log(result));
  res.redirect("/profile");
});

// Redirects user to their profile page on a succesful login POST or back to login page if not a user
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/profile");
    });
  })(req, res, next);
});

// Redirects users back to the index page after logging out or presents an error if you are not logged in
router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.logout();
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.clearCookie("session-id");
        req.user = null;
        res.redirect("/");
        console.log("You have logged out of this world of pizza.");
      }
    });
  } else {
    let err = new Error("What the heck. You are not logged in!");
    err.status = 403;
    next(err);
  }
});

// exports all the things with router (need to research more on how)
module.exports = router;

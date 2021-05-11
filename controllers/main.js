// Imports
const User = require("../models/User");
const PizzaPost = require("../models/Post");
const passport = require("passport");

module.exports = {
    homePage: (req, res) => {
        res.render("index", { user: req.user, title: 'Home', style: 'index', feed: false });
      },
    loginPage: (req, res) => {
        res.render("login", { user: req.user, title: 'Login', style: 'login', feed: false });
      },
    profile: async (req, res) => {
        await PizzaPost.find({ user: req.user.id }).then((response) => {
          res.render("profile", { user: req.user, posts: response,
          title: 'Profile',
          style: 'feed', feed: true });
        });
      },
    feed: async (req, res) => {
        await PizzaPost.find().then((response) => {
          res.render("feed", {
            user: req.user,
            posts: response,
            title: 'Feed',
            style: 'feed',
            feed: true,
          });
        });
      },
    sortByLikes: async (req, res) => {
      await PizzaPost.find().sort({ likes: "desc"}).then((response) => {
        res.render("feed", {
          user: req.user,
          posts: response,
          title: 'Feed',
          style: 'feed',
          feed: true,
        });
      });
    },   
    sortByDislikes: async (req, res) => {
      await PizzaPost.find().sort({ dislikes: "desc"}).then((response) => {
        res.render("feed", {
          user: req.user,
          posts: response,
          title: 'Feed',
          style: 'feed',
          feed: true,
        });
      });
    },   
    signupPage: (req, res) => {
        res.render("signup",  {
            user: req.user,
            title: 'Sign Up',
            style: 'login',
            feed: false,
          });
      },
    createUser: (req, res) => {
        const user = new User(req.body);
        user.save().then((result) => console.log(result));
        res.redirect("/profile");
      },
    doLogin: (req, res, next) => {
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
      },
    logout: (req, res, next) => {
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
      },
}
const express = require("express");
// good video on router and MVC (thanks Wolfie!) https://www.youtube.com/watch?v=zW_tZR0Ir3Q&list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU&index=12&ab_channel=TheNetNinja
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const passport = require("passport");
const mainControllers = require('../controllers/main')

// Changed the from app.get to router.get etc. since we want router used within the app
//Home Page
router.get("/", mainControllers.homePage);

//Login Page
router.get("/login", ensureGuest, mainControllers.loginPage);

//Changing the callback to async because we are sending a request to the DB now
router.get("/profile", ensureAuth, mainControllers.profile);

router.get("/feed", mainControllers.feed);


//Signup Page
router.get("/signup", ensureGuest, mainControllers.signupPage);

//Sign up new user POST request
router.post("/create-user", mainControllers.createUser);

// Redirects user to their profile page on a succesful login POST or back to login page if not a user
router.post("/login", mainControllers.doLogin);

// Redirects users back to the index page after logging out or presents an error if you are not logged in
router.get("/logout", mainControllers.logout);

// exports all the things with router (need to research more on how)
module.exports = router;

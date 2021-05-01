const express = require('express')
// good video on router and MVC (thanks Wolfie!) https://www.youtube.com/watch?v=zW_tZR0Ir3Q&list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU&index=12&ab_channel=TheNetNinja
const router = express.Router()
// This is where we will be requiring the User and ensureAuth, so I don't believe we'll need it in the server anymore? (VKB)
const User = require('../models/User')
const PizzaPost = require('../models/Post')
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const passport = require('passport')

// Changed the from app.get to router.get etc. since we want router used within the app
//Home Page
router.get('/', (req, res) => {
    res.render("index")
})

//Changing the callback to async because we are sending a request to the DB now 
router.get('/profile', ensureAuth, async (req, res) => {
    await PizzaPost.find({user: req.user.id})
    .then(response => {
        console.log(response)
        res.render('profile', {user: req.user, posts: response }) })
    
})

//Login Page
router.get('/login', ensureGuest, (req, res) => {
    res.render('login')
})

//Sign up new user POST request
router.post('/create-user', (req, res) => {
    const user = new User(req.body)
    user.save()
    .then(result => console.log(result))
    res.redirect('/profile')
})

router.post('/login', (req, res, next) => {
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
        })
    })(req, res, next);
})

// exports all the things with router (need to research more on how)
module.exports = router 
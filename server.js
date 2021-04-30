//Initializing express
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/config')
const passport = require('passport')
const User = require('./models/User')
require('dotenv').config({path: './config/.env'})
const { ensureAuth, ensureGuest } = require('./middleware/auth') 

// passport config
require('./config/passport')(passport)

connectDB()


//When we upload to heroku, heroku will add it's own PORT
//until then the server will run on port 3000
const PORT = process.env.PORT || 3000


/* ----- Middleware ----- */

/*Morgan is a logger for development - it logs some data about requests made to the server in the console
try replacing 'dev' with: 'default', 'short', 'common' etc
https://www.npmjs.com/package/morgan */

app.use(require('morgan')('dev'))

// Cookies
app.set('trust proxy', 1)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    //GOOD TO RESEARCH
    saveUnitialized: false,
    //ALSO GOOD TO RESEARCH
    //cookies: {secure: true}
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

/*Setting the view engine to use ejs templates
https://ejs.co/#docs */
app.set('view engine', 'ejs')

//Telling express where to find our static files (CSS, front-end JavaScript)
app.use(express.static('public'))

/*Initializing built in middleware that helps our server deal with
JSON data sent as the request body with a POST or PUT request
http://expressjs.com/en/api.html#express.urlencoded
http://expressjs.com/en/api.html#express.json */
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//Home Page
app.get('/', (req, res) => {
    res.render("index")
})

//Profile Page - will add auth middleware to protect page SOON
app.get('/profile', ensureAuth, (req, res) => {
    console.log(req)
    res.render('profile', {user: req.user})
})

//Login Page
app.get('/login', ensureGuest, (req, res) => {
    res.render('login')
})

//Sign up new user POST request
app.post('/create-user', (req, res) => {
    const user = new User(req.body)
    user.save()
    .then(result => console.log(result))
    res.redirect('/profile')
})

app.post('/login', (req, res, next) => {
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

/*Setting the port that the server will listen to requests on
The console.log will print when the server is listening
http://expressjs.com/en/api.html#app.listen */
app.listen(PORT, console.log(`The Pizza is cooking on port ${3000}`))
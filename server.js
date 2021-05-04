//Initializing express
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const methodOverride = require('method-override')
const connectDB = require('./config/config')
const passport = require('passport')
require('dotenv').config({path: './config/.env'})
//Importing the routers
const mainRoutes = require('./Routes/main')
const pizzaPostRoutes = require('./Routes/post')
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

// Method Override - Allows PUT/DELETE in form methods
app.use(methodOverride('_method'))

/*Setting the view engine to use ejs templates
https://ejs.co/#docs */
app.set('view engine', 'ejs')

//Telling express where to find our static files (CSS, front-end JavaScript)
app.use(express.static('Public'))

/*Initializing built in middleware that helps our server deal with
JSON data sent as the request body with a POST or PUT request
http://expressjs.com/en/api.html#express.urlencoded
http://expressjs.com/en/api.html#express.json */
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Using routes that we've required above
app.use(mainRoutes)
app.use('/post', pizzaPostRoutes)


/*Setting the port that the server will listen to requests on
The console.log will print when the server is listening
http://expressjs.com/en/api.html#app.listen */
app.listen(PORT, console.log(`The Pizza is cooking on port ${3000}`))
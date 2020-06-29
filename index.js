const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// Load config
dotenv.config({ path: './config/config.env' })
// connecting Database
connectDB()
// --------------------------------
const app = express()
// Passport strategy file requiring
require('./config/passport')(passport)
// --------------------------------
// Running only development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// --------------------------------
// Public Access
app.use(express.static(path.join(__dirname, 'public')))
// --------------------------------
// Handlebars -----------------------
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')
// ------------------------------------
// Session Middleware
app.use(session({
  secret: 'ababababab',
  resave: false,
  saveUnintialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })

}))
// ------------------------------------
// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())
// ------------------------------------
// Adding the routes ----------------
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
// -----------------------------------
const PORT = process.env.PORT || 5000
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
// -----------------------------------

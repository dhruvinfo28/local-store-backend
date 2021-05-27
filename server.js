const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const app = require('./app')

app.use(cors());

require('./middlewares/parsingMiddleware')
require('./middlewares/googleAuthConfig')

app.use(session({
    secret:process.env.SESSION_SECRET,
    saveUninitialized:false,
    resave:false
}))

app.use(passport.initialize())
app.use(passport.session());

app.use('/shops',require('./routes/shops'))
app.use('/user',require('./routes/users_auth'))

app.use((err,req,res,next)=>{
    res.status(404).json({
        err:'Not found'
    })
})
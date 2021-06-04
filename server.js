const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const app = require('./app')
const cookieParser = require('cookie-parser')

app.use(cors());
app.use(cookieParser());

require('./middlewares/parsingMiddleware')
require('./middlewares/googleAuthConfig')

app.use(session({
    secret:process.env.SESSION_SECRET,
    saveUninitialized:false,
    resave:false
}))

app.use(passport.initialize())
app.use(passport.session());

app.get('/',(req,res)=>{
    console.log('Reached the server')
    res.status(200).json({message:'Welcome to the backend!'})
})

app.use('/api/shops',require('./routes/shops'))
app.use('/api/user',require('./routes/user_auth2'));
app.use('/api/products', require('./routes/products'))


app.use((err,req,res,next)=>{
    res.status(404).json({
        err:'Not found'
    })
})
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = require('./app')
const cookieParser = require('cookie-parser')

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get('/',(req,res)=>{
    console.log('Reached the server')
    res.status(200).json({message:'Welcome to the backend!'})
})

app.use('/api/shops',require('./routes/shops'))
app.use('/api/user',require('./routes/user_auth2'));
app.use('/api/products', require('./routes/products'))
app.use('/api/orders',require('./routes/orders'))

app.use((err,req,res,next)=>{
    console.log(err)
    res.status(404).json({
        err:'Not found'
    })
})
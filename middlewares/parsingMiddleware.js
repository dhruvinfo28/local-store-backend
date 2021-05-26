const express = require('express')
const app = require('../app')

app.use(express.urlencoded({extended:false}))  
app.use(express.json())
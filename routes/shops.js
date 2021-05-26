const express = require('express')
const bcrypt = require('bcrypt')
const db = require('../middlewares/dbConnection')
const router = express.Router();

router.get('/',(req,res)=>{
    let sql = 'select * from `shops`';
    db.query(sql,(err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

router.post('/register', (req,res)=>{
    const data = req.body;
    if(data.email && data.password && data.name){
        bcrypt.hash(data.password,10)
            .then(hashedPassword=>{
                let sql = 'Insert into `shops`(`email`,`shop_pass`,`name`) values(?,?,?)';
                db.query(sql,[data.email,hashedPassword,data.name],(err,results)=>{
                    if(err) throw err;
                    res.send('Created');
                })
            })
            .catch(err=>{
                throw err;
            })
    }
})

router.get('/login',(req,res)=>{
    
})

module.exports = router;
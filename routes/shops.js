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
    if(data.shop_phone_number && data.shop_password && data.shop_name && data.shop_owner_name && data.shop_address && data.shop_type && data.shop_pincode){
        let searchQuery = 'select * from `shops` where `shop_phone_number` = ?';
        db.query(searchQuery,[data.shop_phone_number], (err,result)=>{
            if(!err){
                if(result.length==0){
                    //Hence not present
                    bcrypt.hash(data.shop_password,10)
                        .then(result=>{
                            let insertQuery = 'insert into shops(`shop_name`,`shop_owner_name`,`shop_password`,`shop_address`,`shop_type`,`shop_phone_number`,`shop_pincode`) values(?,?,?,?,?,?,?)';
                            db.query(insertQuery,[data.shop_name, data.shop_owner_name , result, data.shop_address , data.shop_type ,data.shop_phone_number , data.shop_pincode], (err,result)=>{
                                if(!err){
                                    res.status(201).json({
                                        message: 'Registered'
                                    })
                                }
                            })
                        })
                        .catch(err=>{
                            throw err;
                        })
                    
                }
                else{
                    res.status(409).json({
                        message: 'User already exists'
                    })
                }
            }else{
                console.log(err)
               res.status(500).json({
                   message:'Internal server error'
               })
            }
        })
        // bcrypt.hash(data.password,10)
        //     .then(hashedPassword=>{
        //         let sql = 'Insert into `shops`(`email`,`shop_pass`,`name`) values(?,?,?)';
        //         db.query(sql,[data.email,hashedPassword,data.name],(err,results)=>{
        //             if(err) throw err;
        //             res.send('Created');
        //         })
        //     })
        //     .catch(err=>{
        //         throw err;
        //     })
    }
})

router.get('/login',(req,res)=>{
    
})

module.exports = router;
require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../middlewares/dbConnection')
const router = express.Router();

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
                                }else{
                                    console.log(err);
                                    res.status(500).json({message:'Internal server error'});
                                }
                            })
                        })
                        .catch(err=>{
                            console.log(err)
                            res.status(500).json({
                                message:'Internal server error'
                            })
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
    }
})

router.post('/login',(req,res)=>{
    const data = req.body;
    if(data.shop_phone_number){
        const sql = 'select * from `shops` where `shop_phone_number` = ?';
        db.query(sql,[data.shop_phone_number],(err,result)=>{
            if(!err){
                if(result.length>0){
                    //found
                    bcrypt.compare(data.shop_password,result[0].shop_password)
                        .then((check)=>{
                            if(check){
                                //Correct password
                                let data = {shop_id:result[0].shop_id};
                                jwt.sign(data,process.env.JWT_SECRET,(err,token)=>{
                                    if(err){
                                        console.log(err)
                                        console.log('jwt error')
                                        res.status(500).json({message:'Internal server error'})
                                    }else{
                                        res.status(200).json({
                                            token: token
                                        })
                                    }
                                })
                            }else{
                                //Incorrect password
                                res.status(403).json({message:'Incorrect phone number or password'});
                            }
                        })
                        .catch(err=>{
                            console.log('bcryt error')
                            console.log(err);
                            res.status(500).json({
                                message: 'internal server error'
                            })
                        })
                }else{
                    //Not Found
                    res.status(403).json({
                        message:'Incorrect phone number or password'
                    })
                }
            }else{
                res.status(500).json({message:'Internal Server error'})
            }
        })
    }
})

router.get('/dashboard',(req,res)=>{
    const data = req.headers['authorization'];
    if(data){
        jwt.verify(data,process.env.JWT_SECRET,(err,result)=>{
            if(err){
                res.status(500).json({message:'Internal server error'})
            }else{
                let sql = 'select * from `shops` where `shop_id` = ?';
                db.query(sql,[result.shop_id],(err,result)=>{
                    if(err){
                        res.status(500).json({message:'Internal server error'})
                    }else{
                        res.status(200).json({
                            id: result[0].shop_id,
                            shop_name: result[0].shop_name,
                            shop_owner_name: result[0].shop_owner_name,
                            shop_address: result[0].shop_address,
                            shop_type: result[0].shop_type,
                            shop_phone_number: result[0].shop_phone_number,
                            shop_pincode: result[0].shop_pincode
                        });
                    }
                })
            }
        })
    }else{
        res.status(401).json({
            message:'Unauthorized'
        })
    }
})

module.exports = router;
const app = require('../app')
const express = require('express')
const db = require('../middlewares/dbConnection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const connect_db = require('../middlewares/db_connect')
const router = express.Router();

router.get('/',(req,res)=>{
    res.send('User authentication home route');
})
router.post('/register', (req,res)=>{
    console.log("User registration route");
    if(req.body){
        const obj = req.body;
        if(obj.user_name && obj.user_password && obj.user_email){
            let sqlQuery = 'select * from `users` where `user_email` = ?';
            db.query(sqlQuery,[obj.user_email],(err,result)=>{
                if(err){
                    res.status(500).json({message:'Internal server error'});
                }
                else{
                    if(result.length>0){
                        //found
                        res.status(409).json({message:"User already registered"});
                    }else{
                        bcrypt.hash(obj.user_password,10)
                            .then((result)=>{
                                //Here I have the hashed password
                                let sql = 'insert into `users`(`user_name`,`user_email`,`user_password`,`user_pincode`,`user_address`) values(?,?,?,?,?)';
                                db.query(sql,[obj.user_name,obj.user_email,result,obj.user_pincode,obj.user_address],(err,result)=>{
                                    if(err){
                                        res.status(500).json({message:'Internal server error'});
                                    }else{
                                        res.status(201).json({message:"User registered successfully"});
                                    }
                                })
                            })
                            .catch((err)=>{
                                console.log(err);
                                res.status(500).json({message:'Internal server error'});
                            })
                    }
                }
            })
        }
        else{
            res.status(500).json({message:'Internal server error'});
        }
    }else{
        res.status(500).json({message:'Internal server error'});
    }
})

router.post('/login',(req,res)=>{
    if(req.body){
        const sql = 'select * from `users` where `user_email` = ?';
        db.query(sql,[req.body.user_email],(err,result)=>{
            if(err){
                console.log('Query error')
                console.log(err)
                res.status(500).json({message:'Internal server error'})
            }else{
                if(result.length>0){
                    bcrypt.compare(req.body.user_password,result[0].user_password)
                    .then(check=>{
                        if(check){
                            //Sign the jwt
                            jwt.sign({user_id:result[0].user_id},process.env.JWT_SECRET,(err,token)=>{
                                console.log('token signed');
                                res.cookie('token', token, { httpOnly: true });
                                res.status(200).json({token:token});
                            })
                        }else{
                            console.log('password incorrect');
                            res.status(403).json({message:'Incorrect username or password'})
                        }
                    })
                    .catch(err=>{
                        console.log('bcrypt error')
                        console.log(err)
                            res.status(500).json({message:'Internal server error'})
                    })
                }
                else{
                    console.log('email not found');
                    res.status(403).json({message:'Incorrect username or password'});
                }
            }
        })
    }
})

router.get('/dashboard',(req,res)=>{
    const data  = req.headers['authorization'];
    if(data){
        jwt.verify(data,process.env.JWT_SECRET,(err,result)=>{
            if(err){
                res.status(401).json({message:'Unauthorized'})
            }else{
                let sql = 'select * from `users` where `user_id` = ?';
                db.query(sql,[result.user_id],(err,result)=>{
                    if(err){
                        res.status(500).json({message:'Internal server error'})
                    }else{
                        res.status(200).json({
                            user_id: result[0].user_id,
                            user_name: result[0].user_name,
                            user_email: result[0].user_email,
                            user_address: result[0].user_address,
                            user_pincode: result[0].user_pincode
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

router.post('/search_products',(req,res)=>{

})

router.post('/search_shops',(req,res)=>{

})
module.exports = router;

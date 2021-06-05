require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken');
const db = require('../middlewares/dbConnection');
const router = express.Router();

router.get('/',(req,res)=>{
    console.log("Reached the orders route");
    res.status(200).json({
        message:'welcome to the orders route'
    })
})

router.post('/placeOrder',(req,res)=>{
    const authToken = req.headers['authorization']
    if(authToken){
        jwt.verify(authToken,process.env.JWT_SECRET,(err,result)=>{
            if(err){
                console.log('token expired')
                res.status(403).json({message: 'Unauthorized, try logging in again'})
            }else{
                if(result.user_id){
                    let data = req.body;
                    if(data){
                        data = data.orders;
                        if(data){
                            let sql = "insert into orders(product_id, shop_id, user_id,quantity,price) values(?,?,?,?,?)";
                            let flag = true;
                            for(let i=0;i<data.length;i++){
                                db.query(sql,[data[i].product_id, data[i].shop_id,result.user_id,data[i].quantity,data[i].price],(err,result)=>{
                                    if(err){
                                        flag = false;
                                        console.log('DB error', err);
                                        res.status(500).json({message:'Internal server error'})
                                    }else{
                                        console.log(`Order of product_id ${data[i].product_id} and shop_id ${data[i].shop_id} added`);
                                    }
                                })
                            }
                            if(flag){
                                console.log('All requested orders saved');
                                res.status(200).json({message:'All orders placed'});
                            }
                        }else{
                            console.log('Orders array missing');
                            res.status(400).json({message:'Orders array missing'});
                        }
                    }else{
                        console.log('Request body missing');
                        res.status(400).json({message:'Request body missing'});
                    }
                }else{
                    res.status(403).json({message: 'Unauthorized, try logging in again'})
                }
            }
        })
    }else{
        console.log('Authentication error')
        res.status(403).json({message:'AUthorization token missing'})
    }
})

module.exports = router;
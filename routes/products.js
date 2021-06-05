require('dotenv').config()
const express = require('express')
const router = express.Router();
const db = require('../middlewares/dbConnection')
const jwt = require('jsonwebtoken')

router.post('/addProduct',(req,res)=>{
    console.log('add product route reached')
    const data = req.headers['authorization']
    if(data){
        jwt.verify(data,process.env.JWT_SECRET, (err,result)=>{
            if(err){
                console.log('jwt error')
                res.status(401).json({message:'Unauthorized'})
            }
            else{
                console.log(result,"Im here");
                if(req.body){
                    let obj = req.body;
                   let sql = 'insert into `products`(`shop_id`, `product_name`, `product_brand`, `product_price`, `product_mrp`) values(?,?,?,?,?)';
                   db.query(sql,[result.shop_id,obj.product_name, obj.product_brand, obj.product_price, obj.product_mrp],(errr,db_response)=>{
                       if(errr){
                           console.log('db error!!',errr);
                            res.status(500).json({message:'Internal server error'});
                       }else{
                           console.log('Product saved');
                            res.status(201).json({message:'Product successfully saved'});
                       }
                   })
                }else{
                    console.log('product data missing');
                    res.status(400).json({message:'Product data missing'});
                }
            }
        })
    }else{
        console.log('token missing');
        res.status(401).json({message:'Authorization token missing'});
    }
})

//Fetch all products
router.get('/',(req,res)=>{
    let sql;
    sql = "select products.product_id, products.product_name as product_name, products.product_brand as product_brand, products.product_price as product_price, products.product_mrp as product_mrp  from products inner join shops on shops.shop_id = products.shop_id";
    db.query(sql,[],(err,result)=>{
        if(err){
            console.log("DB error!!", err)
            res.status(500).json({message:'Internal server error'})
        }
        else{
            console.log('All products returned');
            res.status(200).json(result);
        }
    })
})

//Fetch products of a particular shop
router.post('/',(req,res)=>{
    const data = req.body;
    let sql;
    if(data && req.body.shop_id){
        sql = "select products.product_id, products.product_name as product_name, products.product_brand as product_brand, products.product_price as product_price, products.product_mrp as product_mrp  from products inner join shops on shops.shop_id = products.shop_id where shops.shop_id = ?";
        db.query(sql,[req.body.shop_id],(err,result)=>{
            if(err){
                console.log("DB error!!", err)
                res.status(500).json({message:'Internal server error'})
            }else{
                console.log(`Products of shop ${data.shop_id} sent!`)
                res.status(200).json(result);
            }
        })
    }else{
        req.status(400).json({message: 'shop_id missing'});
    }
})

//Fetch products by product name [search bar]
router.post('/search', (req,res)=>{
    console.log('Query to products search bar');
    let data = req.body;
    if(data){
        data = data.product_name;
        if(data){
            let sql = "select shops.shop_id,shops.shop_name,shops.shop_type,shops.shop_owner_name from shops inner join products on shops.shop_id = products.shop_id where products.product_name like ?";
            let p_name = `%${data}%`
            db.query(sql,[p_name],(err,result)=>{
                if(err){
                    console.log('db error', err);
                    res.status(500).json({message:'Internal server error'})
                }else{
                    console.log('Shops with Products of type '+p_name+' returned');
                    res.status(200).json(result);
                }
            })
        }else{
            res.status(400).json({message: 'product_name option missing'})
        }
    }else{
        res.status(400).json({message:'Request body missing'})
    }
})

module.exports = router;
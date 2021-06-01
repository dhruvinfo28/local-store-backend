const express = require('express')
const passport = require('passport');
const db = require('../middlewares/dbConnection');
const router = express.Router();

//users
router.get('/auth',passport.authenticate('google',{
    scope:['profile','email']
}))

router.get('/auth/callback',passport.authenticate('google'),(req,res)=>{
    console.log('here1')
   res.redirect('/api/user/google/curr_user')
})

router.get('/curr_user',(req,res)=>{
    if(req.user){
        let sql = 'select * from `users` where `google_id` = ? ';
        db.query(sql,[req.user.google_id],(err,result)=>{
            if(!err)
                res.status(200).json(result);
            else
                res.json(err);
        })
    }else{
        res.status(400).json({
            err:'Please login again'
        })
    }
})

router.get('/logout',(req,res)=>{
    req.logout();
    res.status(200).json({
        message:'Successfully logged out'
    })
})

module.exports = router;
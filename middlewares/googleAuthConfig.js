require('dotenv').config()
const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy
const db = require('./dbConnection')

passport.serializeUser((user,done)=>{
    done(null,user.google_id);
})

passport.deserializeUser((google_id,done)=>{
    let sql = 'select * from `users` where `google_id` = ?';
    db.query(sql,[google_id],(err,result)=>{
        if(!err){
            done(null,result[0]);
        }
    })
})

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/api/user/google/auth/callback'
}, (accessToken, refreshToken, profile,done) => {
    const sql = 'select `google_id` from users where `google_id`=?';
    console.log('Kahan hai')
    db.query(sql,[profile.id],(err,result)=>{
        if(!err){
            if(result.length!=0){
                //Already there
               done(null,result[0]); 
            }else{
                //First timer
                const newQuery = 'insert into `users` (`google_id`,`user_name`,`user_email`) values(?,?,?)';
                db.query(newQuery,[profile.id,profile.displayName,profile.emails[0].value],(errs,result)=>{
                    if(!errs){
                        console.log('user_saved')
                       done(null,{
                           google_id:profile.id,
                           user_name:profile.displayName,
                           user_email:profile.emails[0].value
                       })
                    }
                    else{
                        throw errs;
                    }
                })
    
            }
        }
    })
}))
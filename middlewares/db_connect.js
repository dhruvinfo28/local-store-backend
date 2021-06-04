const db = require('./dbConnection')

module.exports = (req,res,next)=>{
    db.connect((err)=>{
        if(err){
            req.status(500).json({message:'Internal server error'})
        }
        else {
            next();
        }
    })
}
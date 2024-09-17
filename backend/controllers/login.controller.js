const Author  = require('../models/blogAuthorSchema') ;
const bcrypt = require('bcrypt') ; 

const verifyUser =  async (req,res) => {

    try{

        const {email, password} = req.body ;
        const author = await Author.findOne({email});

        if(!author){
          return  res.status(400).json({message:"Invalid Email"}) ;
        }
        
        const isMatch = await author.comparePassword(password) ;
        
        if(!isMatch){
           return res.status(400).json({message:"Invalid Password"}) ;
        }

        res.status(200).json({message:"Login Successfull",author}) ;

    }
    catch(err){

     res.send("Error" + err) ;

    }
}

module.exports = {verifyUser}
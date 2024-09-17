const express = require('express') ;
const router = express.Router() ;
const Author  = require('../models/blogAuthorSchema') ;
const bcrypt = require('bcrypt') ; 
const {verifyUser} = require('../controllers/login.controller')

router.post('/',verifyUser) ;
module.exports = router ;
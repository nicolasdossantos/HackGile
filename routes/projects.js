const express = require('express');
const router = express.Router();
const functions = require('../app');

router.get('/home', (req,res)=>{
    res.render('home');
});


module.exports = router;
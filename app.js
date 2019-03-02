const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const expressValidator = require("express-validator");
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const config = require('./config/database');
// const passport = require('passport');

//Mongoose midleware
//Setup DB
mongoose.connect(config.database, {useNewUrlParser: true});
let db = mongoose.connection;

//Check for DB errors
db.on('error', (err)=>{
    console.log(err);
});

//Test connection
db.once('open', ()=>{
    console.log("Connected to DB");
});

//Let App use express Validator -> This module lets you check if
//required fields are filled out
app.use(expressValidator());

//Bring in models
let Project = require('./models/project');
let Member = require('./models/member');
let Sprint = require('./models/sprint');
let Story = require('./models/story');

//Load View engine / Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body Parser middleware parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Create global variable user
app.get('*', (req,res,next)=>{
    res.locals.user = req.user || null;
    next();
})



app.get("/", (req, res)=>{
    res.render('index');
});

app.get("/login", (req, res)=>{
    res.render('login');
});

app.get("/signup", (req,res)=>{
    res.render('signup');
});



app.listen(7000, ()=>{
    console.log("Listening on port 7000...");
});



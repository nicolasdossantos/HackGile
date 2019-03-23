const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const config = require('./config/database');
const passport = require('passport');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
'use strict';


//Mongoose midleware
//Setup DB
mongoose.connect(config.database, {useNewUrlParser: true});
let db = mongoose.connection;

//Check for DB errors
db.on('error', (err) => {
    console.log(err);
});

//Test connection
db.once('open', () => {
    console.log("Connected to DB");
});

//Bring in models
let Project = require('./models/project');
let Member = require('./models/member');
let Sprint = require('./models/sprint');
let Story = require('./models/story');

// //For Testing. This will remove all members from database
// Member.deleteMany({}, (err)=>{
//     if(err){
//         console.log(err);
//     }
//     console.log("Entries have been removed");
// });


// //For Testing. This will remove all members from database
// Project.deleteMany({}, (err)=>{
//     if(err){
//         console.log(err);
//     }
//     console.log("Entries have been removed");
// });

//Load View engine / Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body Parser middleware parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

//Cookie Session init
app.use(cookieSession({
    //24 hours in millisec
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]

}));

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Let App use express Validator -> This module lets you check if
//required fields are filled out
app.use(expressValidator());

//Passport Config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Create global variable user
app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

//Route files
let projects = require('./routes/projects');
let members = require('./routes/members');
let sprints = require('./routes/sprints')
app.use('/sprints', sprints);
app.use('/projects', projects);
app.use('/members', members);


//Index Route
app.get("/", (req, res) => {
    res.render('index');
});

app.get("/card", (req, res) => {
    res.render('story_card');
});

app.listen(8080, () => {
    console.log("Listening on port 8080...");
});


function ensureAuthentication(req, res, next) {

    if (req.isAuthenticated()) {
        return next();

    } else {
        req.flash('cardError', 'Please Login');

        res.redirect('/members/login');

    }
}

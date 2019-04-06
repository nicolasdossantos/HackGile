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
const cors = require('cors');

//Mongoose midleware
//Setup DB
mongoose.connect(config.database, {
    useNewUrlParser: true
});
const db = module.exports = mongoose.connection;
db.useDb('test');

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
// Project.deleteMany({}, (err)=>{
//     if(err){
//         console.log(err);
//     }
//     console.log("Entries have been removed");
// });

//Load View engine / Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//API middleware
app.use(express.json());
app.use(cors());

//Body Parser middleware parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

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
app.get('*', ensureSecure, (req, res, next) => {
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

let storiesapi = require('./routes/api/stories');
app.use('/api/stories', storiesapi);
let membersapi = require('./routes/api/members');
app.use('/api/members', membersapi);
let sprintsapi = require('./routes/api/sprints');
app.use('/api/sprints', sprintsapi);
let projectsapi = require('./routes/api/projects');
app.use('/api/projects', projectsapi);


//Index Route
app.get("/", ensureSecure, (req, res) => {
    res.render('index');
});

app.get("/card", (req, res) => {
    res.render('story_card');
});

app.listen(8080, () => {
    console.log("Listening on port 8080...");
});

//HTTPS redirect middleware
function ensureSecure(req, res, next) {
    //Heroku stores the origin protocol in a header variable. The app itself is isolated within the dyno and all request objects have an HTTP protocol.
    if (req.get('X-Forwarded-Proto') == 'https' || req.hostname == 'localhost') {
        //Serve Angular App by passing control to the next middleware
        next();
    } else if (req.get('X-Forwarded-Proto') != 'https' && req.get('X-Forwarded-Port') != '443') {
        //Redirect if not HTTP with original request URL
        res.redirect('https://' + req.hostname + req.url);
    }
}


exports.db = db;
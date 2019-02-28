const express = require('express');
const app = express();
const path = require('path');

app.get("/", (req, res)=>{
    res.render('index');
});

app.get("/login", (req, res)=>{
    res.render('login');
});

app.get("/signup", (req,res)=>{
    res.render('signup');
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.static(__dirname + '/public'));



app.listen(7000, ()=>{
    console.log("Listening on port 7000...");
});



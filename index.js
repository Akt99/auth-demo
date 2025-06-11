const express = require("express");
const jwt = require('jsonwebtoken');
const JWT_SECRET = "randomabcdefg"
const app = express();
app.use(express.json());
app.use(express.static("publicFE"));


const users = [];

function logger(req, res, next){
    console.log(req.method + "request came");
    next();
}
app.get("/", function(req, res){
    res.sendFile(__dirname + "/publicFE/index.html");
});
app.post("/signup", logger, function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username: username,
        password: password
    })
    res.json({
        message: "You are signed up"
    })
    console.log(users)
});

app.post("/signin", logger, function(req,res){

    const username = req.body.username;
    const password = req.body.password;

    let foundUser=null;

    for (let i=0; i<users.length; i++){
        if (users[i].username==username&&users[i].password==password)
        {
            foundUser=users[i]
        }
    }
    if (foundUser){
        const token= jwt.sign({username: foundUser.username}, JWT_SECRET);
        foundUser.token = token;
        res.json({
            token: token
        });
    }else{
        res.status(403).send({
            message: "Invalid username or password"
        })
    }
    console.log(users)
    })

function auth(req, res, next){
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET);
    if (decodedData.username){
        req.username = decodedData.username;
        next()
    } else{
        res.json({
            message: "You are not logged in"
        })
    }
    }

app.get("/me", logger, auth, function(req, res){
    const currentUser = req.username;
    let foundUser = null;
    

    for (let i=0 ;i < users.length ; i++) {
        if (users[i].username == currentUser) {
            foundUser = users[i]
        }
    }
    if (foundUser){
        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
    
    } else {
        res.json({
            message: "token invalid"
        })
    }
})
app.listen(3000);
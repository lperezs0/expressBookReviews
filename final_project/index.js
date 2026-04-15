const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { authenticated } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

//middleware to authenticate request from the user endpoint
app.use("/customer/auth/*", function auth(req,res,next){
 
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        //verity the jwt token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            }
            else {
                return res.status(403).json({message: "User ot authenticated"});
            }
        }

        )
        
    }
    else{
        return res.status(403).json({message: "User not logged in"});
    }
});

//login endpoint
app.post("/login", (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;

//check if user name and password are missing before clicking login
    if (!username || !password){
        return res.status(404).json({message: "Error loggin in"});
    }

    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60}
        )
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid login. Check username and password and try again"})
    }
});

//register a new user
app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if(!doesExist(username)){
            user.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered, Now you can login"})
        }
        else{
            return res.status(404).json({message: "Username not available, try a different one!"});
        }
        
    }
    return res.status(404).json({message: "Unable to register user."});
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
//Navigate to index.js and update the authentication code under app.use("/customer/auth/*", function auth(req,res,next){:
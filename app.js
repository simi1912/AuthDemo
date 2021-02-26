var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    localStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");

var User = require("./models/user");

mongoose.connect("mongodb://localhost/auth_demo_app");

var app = express();
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Ana",
    resave: false,
    saveUnintialized: false
}));

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROUTES
//========

app.get("/", function(req, res){
   res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

//Auth Routes

//Sign Up Form
app.get("/register", function(req, res) {
    res.render("register");
});

//Handling Sign Up
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}),
        req.body.password,function(err, user){
            if(err){
                console.log(err);
                return res.render("register");
            } 
            passport.authenticate("local")(req, res, function(){
               res.redirect("/secret");
            });
        });
});

// Lohin Form
app.get("/login", function(req, res) {
    res.render("login");
})

// Handle Login
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
})

// Logout
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req, res, next){
    console.log("IN isLoggedIn")
    if(req.isAuthenticated()){
        console.log("IS isLoggedIn")
        return next();
    }
    console.log("NOT isLoggedIn")
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Serves has started...");
});
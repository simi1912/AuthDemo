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

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROUTES
//========

app.get("/", function(req, res){
   res.render("home");
});

app.get("/secret", function(req, res){
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

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Serves has started...");
});
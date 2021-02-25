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
app.use(require("express-session")({
    secret: "Ana",
    resave: false,
    saveUnintialized: false
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
   res.render("home");
});

app.get("/secret", function(req, res){
    res.render("secret");
});


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Serves has started...");
});
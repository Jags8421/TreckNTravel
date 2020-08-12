var express     =  require("express");
var app         =  express();
app.set("view engine","ejs");
//Body Parse is used to read Data from Form
var bodyParser = require("body-parser");
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({ 
	secret:"shubakar",
	resave:false,
	saveUninitialized:false
}))
var mongoose = require("mongoose");
mongoose.connect(process.env.DATABASEURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DataBase!'))
.catch(error => console.log(error.message));
//Declaring directory to look for css and js files
app.use(express.static(__dirname + '/public'));
//Method override allows us to have PUT and DELETE requests
var methodOverride = require("method-override");
app.use(methodOverride("_method"));
var User=require("./models/users/users");
//Handel Authentaction
var passport=require("passport");
var LocalStrategy  = require("passport-local");
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
var Comment        = require("./models/comments/comments");
var Campground     = require("./models/campgrounds/campgrounds");
var indexrouter    = require("./routes/index");
var commentsrouter = require("./routes/comments");
var authrouter     = require("./routes/auth");

app.use(indexrouter);
app.use(commentsrouter);
app.use(authrouter);
//Improper Request Handler
app.get("*",function(req,res){
	res.send("Improper Request");
});
app.listen(process.env.PORT, process.env.IP,function(){
	console.log("Yelp Camp is Started");
});

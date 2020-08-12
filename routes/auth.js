//Routes related to Authentication
var express=require("express");
var router=express.Router();
var bodyParser = require("body-parser");
router.use( bodyParser.json() );
router.use(bodyParser.urlencoded({extended: true}));
router.use(require("express-session")({ 
	//Secret message used to Encode and Decode password
	secret:"shubakar",
	resave:false,
	saveUninitialized:false
}))
var User=require("../models/users/users");
var passport=require("passport");
var LocalStrategy=require("passport-local");
router.use(passport.initialize());
router.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
//Get SignUp form
router.get("/signup",function(req,res){
	res.render("signup",{currentuser:req.user});
});
//Create New User
router.post("/signup",function(req,res){
	//Defining new user 
	User.findOne({username:req.body.username},function(err,user){
		if(err){
			console.log(err);
		}
		else if(user===null){
			var newuser=new User({username:req.body.username});
			//Creating new User(save to database)
			User.register(newuser,req.body.password,function(err,user){
				if(err){
					console.log(err);
					res.redirect("/signup",{currentuser:req.user});
				}
				else{
					res.redirect("/index");
				}
			});
		}
		else{
			res.render("signuperror",{currentuser:req.user});
		}
	});
	
});
//Login form
router.get("/login",function(req,res){
	res.render("login",{currentuser:req.user});
});
//Function for User Authentication
router.post("/login",passport.authenticate("local",{
	//if password is verified-redirect to /index
	successRedirect:"/index",
	//if password or user is not registered or any error in Authentication -redirect to login form
	failureRedirect:"/login"
	}),function(req,res){
		
});
//function to logout
router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/index");
});
module.exports=router;
//Routes related to Campground
var express        = require("express");
var router         = express.Router();
//Method override used to have routes other than post and get(Ex:PUT,DELETE)
var methodOverride = require("method-override");
router.use(methodOverride("_method"));
//Importing Campground model
var Campground=require("../models/campgrounds/campgrounds");
//Importing Comments model
var Comment=require("../models/comments/comments");
//Importing middleware
var middleware=require("../middleware/middleware");
//Home page Route
router.get("/",function(req,res){
	res.render("home",{currentuser:req.user});
});
//Campground page Route
router.get("/index",function(req,res){
	Campground.find({ },function(err,campgrounds){
		res.render("campgrounds/campgrounds",{items:campgrounds, currentuser:req.user});
	});
});
//Form to create new Campground
router.get("/index/new", middleware.isLoggedIn ,function(req,res){
	res.render("campgrounds/new",{currentuser:req.user});
});
//Save new Campground to Data Base
router.post("/create",middleware.isLoggedIn, function(req,res){
	//Reading Form Details
	var inputdetails=req.body;
	//Reading User Data-if loggedin
	var userdetails=req.user;
	var newcampgrounds={
		name: inputdetails.name,
		image: inputdetails.image,
		description: inputdetails.description,
		rating:inputdetails.rating,
		author:{
			id : userdetails._id,
			user:userdetails.username
		}
	};
	Campground.create(newcampgrounds,function(err,camp_retuned){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/index/new");
		}
	});
});
//Form to edit existing Campground
router.get("/index/:id/edit",middleware.verifyuser, function(req,res){
	Campground.findById(req.params.id,function(err,foundcampround){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/edit",{camp:foundcampround,currentuser:req.user});
		}
	});
});
//Update and save changes to existing Campground
router.put("/index/:id",middleware.verifyuser, function(req,res){
	Campground.findById(req.params.id,function(err,camp){
		var temp={
			name:req.body.name,
			image:req.body.image,
			description:req.body.description,
			rating:req.body.rating,
			author:camp.author,
			comments:camp.comments
		};
		Campground.findByIdAndUpdate(req.params.id,temp,function(err,updatedcamp){
			if(err){
				console.log(err);
			}
			else{
				res.redirect("back");
			}
		});
	});
});
//Delete a Campground and associated Comments from Data Base
router.delete("/index/:id",middleware.verifyuser,function(req,res){
	//Remove Comments associated with Campground having id
	Campground.findById(req.params.id, function(err,camp){
		if(err){
			console.log(err);
		}
		else{
			camp.comments.forEach(function(commentinpost){
				Comment.findByIdAndRemove(commentinpost,function(err){
					if(err){
						console.log(err);
					}
				});		
			});
		}
	});
	//Remove Campground from Data Base
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/index");
		}
	});
});
module.exports=router;
//Routes related to Comments
var express=require("express");
var router=express.Router();
var Campground=require("../models/campgrounds/campgrounds");
var Comment=require("../models/comments/comments");
var bodyParser = require("body-parser");
router.use( bodyParser.json() );
router.use(bodyParser.urlencoded({extended: true}));
router.use(require("express-session")({ 
	//Secret message used to Encode and Decode password
	secret:"shubakar",
	resave:false,
	saveUninitialized:false
}))
//Import middleware
var middleware=require("../middleware/middleware");

//Show Campground with id
router.get("/index/:id",function(req,res){
	Campground.findById(req.params.id).populate('comments').exec(function(err, camp) {
    	if (err){
			console.log(err);
		}
		else{
			console.log("user data");
			console.log(req.user);
			res.render("campgrounds/show",{camp:camp,currentuser:req.user});
		}
	});
						
});
//Form to create a new comment for a Campground with id
router.get("/index/:id/comments", middleware.isLoggedIn , function(req,res){
	Campground.findById(req.params.id,function(err,id){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/newcomment",{id:id,currentuser:req.user});	
		}
	});
});
//Create a new comment and save it to Data Base
router.post("/index/:id/comments",middleware.isLoggedIn ,function(req,res){
	Campground.findById(req.params.id,function(err,id){
		if(err){
			console.log(err);
		}
		else{
			temp={
				comment:req.body.comment,
				rating:req.body.rating,
				author:{
					id:req.user._id,
					user:req.user.username
				}
			}
			Comment.create(temp,function(err,comment){
				if(err){
					console.log(err);
				}
				else{
					id.comments.push(comment._id);
					id.save();
					res.redirect("/index/"+id._id);
				}
			});	
		}
	});
});
//Form to edit existing comment
router.get("/index/:campgroundid/comment/edit/:commentid",middleware.isverified ,function(req,res){
	Campground.findById(req.params.campgroundid,function(err,camp){
		if(err){
			console.log(err);
		}
		else{
			Comment.findById(req.params.commentid,function(err,commentid){
				if(err){
					console.log(err);
				}
				else{
					res.render("comments/editcomment",{id:camp,currentuser:req.user,commentid:commentid});
				}
			});
		}
	});
});
//Update existing comment
router.put("/index/:campgroundid/comment/:commentid",middleware.isverified, function(req,res){
	Comment.findById(req.params.commentid,function(err,comment){
		if(err){
			console.log(err);
		}
		else{
			var temp=comment;
			temp.comment=req.body.comment;
			temp.rating=req.body.rating;
			Comment.findByIdAndUpdate(req.params.commentid,temp,function(err,camp){
				if(err){
					console.log(err);
				}
				else{
					res.redirect("/index/"+req.params.campgroundid);
				}
			});
		}
	});
});
//Delete a Comment
router.delete("/index/:campgroundid/comment/:commentid",middleware.isverified, function(req,res){
	
	Comment.findByIdAndRemove(req.params.commentid,function(err){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("back");
		}
	});
});
module.exports=router;
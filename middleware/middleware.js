var middleware = { };
var Campground = require("../models/campgrounds/campgrounds");
var Comment    = require("../models/comments/comments");
//Middleware to check Authentication of User
middleware.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect("/login");
	}
}
//Middleware to check permission for user to update Campground information
middleware.verifyuser=function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,camp){
			if(err){
				console.log(err);
			}
			else{	
				if(req.user._id.equals(camp.author.id)){
					return next();
				}
				else{
					res.send("No permissin!!!");
				}
			}
		});
	}
	else{
		res.redirect("/login");
	}
}
//Middleware to check permission for user to update Comment information
middleware.isverified=function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.commentid,function(err,comment){
			if(err){
				console.log(err);
			}
			else{
				if(comment.author.id.equals(req.user._id)){
					return next();
				}
				else{
					res.send("You are not Authorised to make this request");
				}
			}
		});
	}
	else{
		res.redirect("/login");
	}
}

module.exports=middleware
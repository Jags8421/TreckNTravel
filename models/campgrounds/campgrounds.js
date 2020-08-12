const mongoose = require('mongoose');

//importing Comments
var Comment=require("../comments/comments");
//Defining Campground Schema
var campgroundSchema=new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	rating:String,
	author:{
		id:{
			type:mongoose.Types.ObjectId,
			ref:"Users"
		},
		user:String
	},
	comments:[{
		type:mongoose.Types.ObjectId,
		ref:"Comment"
	}]
});
//Creating Campground Schema and exporting it to other files
module.exports=mongoose.model("campground", campgroundSchema);
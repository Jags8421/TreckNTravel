const mongoose = require('mongoose');
//Defining Comments Schema
var commentsSchema=new mongoose.Schema({
	comment: String,
	rating:String,
	author: {
		id: {
			type:mongoose.Types.ObjectId,
			ref:"Users"
		},
		user: String
	}
});
//Creating Campground Schema
var Comments=mongoose.model("Comment", commentsSchema);
//Exporting Comments to other files
module.exports=Comments;

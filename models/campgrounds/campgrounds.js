const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://shubakarYelpCampDB:subbuP123456.@cluster0.ao3pb.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to campground!'))
.catch(error => console.log(error.message));
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
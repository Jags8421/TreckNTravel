const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/db_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to comments!'))
.catch(error => console.log(error.message));
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
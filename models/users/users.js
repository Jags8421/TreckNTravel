const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/db_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to Users!'))
.catch(error => console.log(error.message));
//Importing passport-local-mongoose
//used to hide and work with password
var passportLocalMongoose=require("passport-local-mongoose");
//Declaring User model
var userSchema=new mongoose.Schema({
	username: String,
	password: String
});
userSchema.plugin(passportLocalMongoose);
//Creating User Schema
var Users=mongoose.model("Users", userSchema);
//Exporting Users to other files
module.exports=Users;
var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');

mongoose.connect("mongodb://localhost/carsellingMinordb");

var userSchema = mongoose.Schema({
  name:String,
  username:String,
  email:String,
  password:String,
  prflImage: {
    type : String,
    default: '../images/uploads/defprfl.jpg'
  },
  allcar: [{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'car'
  }]
  
});
userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);

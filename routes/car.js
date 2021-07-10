var mongoose = require('mongoose');

var carSchema = new mongoose.Schema({
    carprice: String,
    carname:String,
    contact:String,
    carimg:String,
    sellerid: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
});

module.exports = mongoose.model('car', carSchema);
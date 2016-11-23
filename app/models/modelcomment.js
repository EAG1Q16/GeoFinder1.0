/**
 * Created by Andrea on 23/11/2016.
 */
var mongoose = require('mongoose');

var comment = new mongoose.Schema({
    text: String,
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}],
    adventures: [{type: mongoose.Schema.Types.ObjectId, ref: 'Adventures'}],
});



module.exports = mongoose.model('Comments', comments);
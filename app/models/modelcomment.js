/**
 * Created by Andrea on 23/11/2016.
 */
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var comment = new mongoose.Schema({
    text: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    commentdate: {type:Date, default:Date.now}
});

comment.plugin(deepPopulate, null);


module.exports = mongoose.model('Comments', comment);
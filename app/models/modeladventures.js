/**
 * Created by mbmarkus on 26/10/16.
 */
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);


var adventures = new mongoose.Schema({
    name: String,
    description: String,
    difficulty: String,
    location:
    {
        type: { type: String },
        coordinates: []
    },
    hints: [{type: mongoose.Schema.Types.ObjectId, ref: 'Hints'}],
    image: String,
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comments'}],
});

adventures.plugin(deepPopulate, null);

adventures.index({location: '2dsphere'});

module.exports = mongoose.model('Adventures', adventures);






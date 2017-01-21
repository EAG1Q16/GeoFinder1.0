/**
 * Created by mbmarkus on 22/11/16.
 */

var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var hints = new mongoose.Schema({
    index: Number,
    text: String,
    image: String,
    location:
        {
            type: { type: String },
            coordinates: []
        },
    indication:
        {
            distance: Number,
            sense: String
        },
    final: {
        type: Boolean,
        default: false
    }
});
hints.plugin(deepPopulate, null);

hints.index({location: '2dsphere'});


module.exports = mongoose.model('Hints', hints);
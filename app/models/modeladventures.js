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
    image: {type: String, default: 'http://media.treehugger.com/assets/images/2016/07/green-forest-trees.jpg.662x0_q70_crop-scale.jpg'},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comments'}],
    registerdate: {
        type : Date, default: Date.now
    },
    favs:{type: Number, default: 0
    }
});

adventures.plugin(deepPopulate, null);

adventures.index({location: '2dsphere'});

module.exports = mongoose.model('Adventures', adventures);






/**
 * Created by mbmarkus on 26/10/16.
 */

var express = require('express');
var mongoose = require('mongoose');
var Hints = require('../models/modelhints');
var router = express.Router();

// GET adventures in list
router.get('/', function(req, res) {

    Hints.find(function (err, hints) {
        if (err)
            res.send(err);
        res.send(hints);
    });

});

// GET adventure by ID
router.get('/id/:hint_id', function(req, res){
    Hints.findById(req.params.hint_id, function(err, hint){
        if(err)
            res.send(err)
        res.send(hint);
    });
});

// Create an Hint
router.post('/createhint/', function(req, res) {
    Hints.create({
        index:req.body.index,
        text:req.body.text,
        image:req.body.image,
        location:
        {
             type: req.body.location_type,
             coordinates: req.body.location_coordinates
        },
        indication:
        {
            distance: req.body.distance,
            sense: String,
        }
    }, function(err, hint) {
        if (err)
            res.send(err);
        Hints.findById(hint._id, function (err, hint) {
            if (err)
                res.send(err);
            res.send(hint);
        });
    });
});


//Delete Hint
router.delete('/removehint/', function(req, res) {

    Hints.remove({
        _id : req.body.hint_id
    }, function(err) {
        if (err)
            res.send(err)
    });
});


module.exports = router;

/**
 * Created by mbmarkus on 26/10/16.
 */

var express = require('express');
var mongoose = require('mongoose');
var Hints = require('../models/modelhints');
var Adventures = require('../models/modeladventures');
var geolib = new require('geolib');
var router = express.Router();

// GET hints in list
router.get('/', function(req, res) {

    Hints.find(function (err, hints) {
        if (err)
            res.send(err);
        res.send(hints);
    });

});

// GET hints by ID
router.get('/id/:hint_id', function(req, res){
    Hints.findById(req.params.hint_id, function(err, hint){
        if(err)
            res.send(err)
        res.send(hint);
    });
});

// Create an Hint
router.post('/createhint/', function(req, res) {

    console.log(req.body._id);
    Adventures.findById(req.body._id, function(err, adventure) {
        if (err){
            res.send(err)
        }
        var new_index, a_long, a_lat, b_long, b_lat, distance = 0;
        var direction = null;
        console.log(adventure);

        //Indicación de los indices
        if (adventure.hints.length <= 0) {
            new_index = 0;
            a_long = adventure.location.coordinates[0];
            a_lat = adventure.location.coordinates[1];
        }
        else {
            Hints.findById(adventure.hints[adventure.hints.length - 1], function(err, hint){
                if(err)
                    res.send(err)

                a_long = hint.location.coordinates[0];
                a_lat = hint.location.coordinates[1];
                new_index = adventure.hints.length;

                b_long = req.body.location_coordinates[0];
                b_lat = req.body.location_coordinates[1];

                console.log("hasta aqui llego");

                distance = geolib.getDistanceSimple(
                    {latitude: a_lat, longitude: a_long},
                    {latitude: b_lat, longitude: b_long}
                );
                direction = geolib.getCompassDirection(
                    {latitude: a_lat, longitude: a_long},
                    {latitude: b_lat, longitude: b_long}
                );

                console.log(direction);
                console.log(distance);
                console.log(new_index);

                Hints.create({
                    index:new_index,
                    text:req.body.text,
                    image:req.body.image,
                    location:
                        {
                            type: req.body.location_type,
                            coordinates: req.body.location_coordinates
                        },
                    indication:
                        {
                            distance: distance,
                            sense: direction.exact
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
        }
    });
});


//Delete Hint
router.delete('/removehint/:id', function(req, res) {

    Hints.remove({
        _id : req.params.id
    }, function(err) {
        if (err)
            res.send(err)
    });
});


module.exports = router;

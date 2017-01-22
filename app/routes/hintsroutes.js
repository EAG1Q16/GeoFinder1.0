/**
 * Created by mbmarkus on 26/10/16.
 */

var express = require('express');
var mongoose = require('mongoose');
var Hints = require('../models/modelhints');
var Adventures = require('../models/modeladventures');
var geolib = new require('geolib');
var multer = require('multer');
var upload = multer({dest: __dirname+'/../uploads'});
var cloudinary  = require('cloudinary');
var User = require('../models/modeluser');
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
        console.log(adventure.hints.length);

        if (adventure.hints.length == 0){
            Hints.create({

                index:0,
                text:req.body.text,
                image:req.body.image,
                location:
                    {
                        type: req.body.location_type,
                        coordinates: req.body.location_coordinates
                    },
                indication:
                    {
                        distance: 0,
                        sense: 'No Disponible'
                    }
            }, function(err, hint) {
                if (err)
                    res.send(err);
                res.send(hint);
            });
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

                console.log(b_long);
                console.log(b_lat);

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

                //Actualizo la anterior
                Hints.update({_id : hint._id
                    },
                    {$set:
                        {
                            indication:
                                {
                                    distance: distance,
                                    sense: direction.exact
                                }
                        }
                    },
                    function(err, hint) {
                        if (err)
                            res.send(err);

                        //Ahora creo la otra
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
                                    distance: 0,
                                    sense: 'Waiting for a new Hint'
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

router.put('/makefinal/:id', function(req, res) {
    Hints.update({_id : req.params.id
        },{$set:{final: true
        }},
        function(err, hint) {
            if (err)
                res.send(err);


            //Esta puesto aquí para evitar que los usuarios generen 5000 aventuras sin agregar ninguna pista
            // y ganen puntos de forma ilegal
            var query = {_id: req.body.id};
            var update = {$inc : {"score" : 20}};
            var options = {};

            User.findOneAndUpdate(query, update, options, function(err, adventure) {
                if (err) {
                    res.send(err);
                }
                console.log(adventure);
            });

            Hints.findById(req.params.id, function(err, hint){
                if(err)
                    res.send(err)
                res.send(hint);
            });
        });
});

//Modify the username of a user
router.put('/update/username/:user_id', function(req, res) {
    var query = {username: req.body.username};
    User.findOne(query, function(err, existingUser) {
        if (existingUser) {
            res.status(400).send('Este usuario ya existe prueba con otro :)')
        }
        else {
            console.log('Estoy en User diferente');
            User.update({
                    _id: req.params.user_id
                }, {
                    $set: {
                        username: req.body.username
                    }
                },
                function (err, user) {
                    if (err)
                        res.send(err);
                    User.findById(req.params.user_id, function (err, user) {
                        if (err)
                            res.send(err)
                        res.send(user);
                    });
                });
        }
    });
});

//Upload Fotos
router.post('/update/image/', upload.single('file'), function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(result) {
        console.log(result);
       res.send(result.url);
    });
});


module.exports = router;

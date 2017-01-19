/**
 * Created by mbmarkus on 26/10/16.
 */

var express = require('express');
var mongoose = require('mongoose');
var Hints = require('../models/modelhints');
var Adventures = require('../models/modeladventures');
var router = express.Router();
var geolib = new require('geolib');

// GET adventures in list
router.get('/', function(req, res) {

    Adventures.find({}).deepPopulate(['adventures.comments', 'comments.user', 'hints']).exec().then(function (err, adventures) {
        if (err)
            res.send(err);
        res.send(adventures);
    });

});

// GET adventure by ID
router.get('/id/:adv_id', function(req, res){
    Adventures.findById(req.params.adv_id).deepPopulate(['adventures.comments', 'comments.user', 'hints']).exec().then(function(err, adventure){
        if(err)
            res.send(err)
        res.send(adventure);
    });
});

// Create an Adventure
router.post('/createadventure/', function(req, res) {
    Adventures.create({
        name:req.body.name,
        description:req.body.description,
        difficulty:req.body.difficulty,
        location:
        {
             type: req.body.location_type,
             coordinates: req.body.location_coordinates
        }
    }, function(err, adv) {
        if (err)
            res.send(err);

        Hints.create({
            index:0,
            text:req.body.hint.text,
            image:req.body.hint.image,
            location:
                {
                    type: 'Point',
                    coordinates: req.body.location_coordinates
                },
            indication:
                {
                    distance: 0,
                    sense: req.body.hint.direction
                }
        }, function(err, hint) {
            if (err)
                res.send(err);

            var query = {_id: adv._id};
            var update = {$addToSet : {"hints" : hint._id}};
            var options = {};

            Adventures.findOneAndUpdate(query, update, options, function(err) {
                if (err) {
                    res.send(err);
                }
                Adventures.findById(req.params.adv_id).deepPopulate(['adventures.comments', 'comments.user', 'hints']).exec().then(function(err, adventure){
                    if(err)
                        res.send(err)
                    res.send(adventure);
                });
            });

        });
    });

});


//Delete Adventure
router.delete('/removeadventure/', function(req, res) {

    Adventures.remove({
        _id : req.body.adventure_id
    }, function(err) {
        if (err)
            res.send(err)
    });
});

/**
 *
 *  Hints Zone
 *
 */
//La variable pathdeepPopulate se utiliza para no repetir los paths en cada pathdeepPopulate
var pathdeepPopulate = ['adventures.created', 'adventures.favs', 'adventures.played', 'hints'];
// Assign Hint <--> Adventure
router.post('/ahintdadv/', function(req, res) {
    console.log(req.body);

    var query = {_id: req.body.adventure_id};
    var update = {$addToSet : {"hints" : req.body.hint_id}};
    var options = {};

    Adventures.findOneAndUpdate(query, update, options, function(err, user) {
        if (err) {
            res.send(err);
        }
        console.log(user);
    });

    Adventures.find({_id: req.body.adventure_id}).deepPopulate(pathdeepPopulate).exec().then(function (err, user) {
        if(err)
            res.send(err)
        res.send(user);
    });
});


router.post('/near/', function (req, res){

    var lat = req.body.latitude;
    var lon = req.body.longitude;
    var rd = req.body.radius;

    console.log(lat);
    console.log(lon);
    console.log(rd);

    Adventures.find(function (err, adventures) {
        console.log("Adv");
        console.log(adventures.length);
        //console.log(Adv);
        var cercanas = [];
        adventures.forEach(function (adventure, index)
        {
            if(typeof(adventure.location.coordinates[0] || adventure.location.coordinates[0]) == 'undefined')
            {
                console.log("Aventura ID: " + adventure._id + ", Nombre: " +adventure.name
                    + " con indice: " + index + " tiene un defecto en su forma o esta mal creada");
            }
            else
            {
                var c_long = adventure.location.coordinates[0];
                var c_lat = adventure.location.coordinates[1];
                var test = geolib.isPointInCircle({latitude: lat, longitude: lon},
                    {latitude: c_lat, longitude: c_long},
                    rd);

                if(test == true)
                {
                    cercanas.push(adventure);
                }
                else
                    console.log('false');
            };
        });
        res.send(cercanas);
    });

});


router.get('/hints/:id', function (req, res){
    var id = req.params.id;

});

router.post('/hintnear/', function (req, res){

    var lat = req.body.latitude;
    var lon = req.body.longitude;
    var id =req.body.advid;

    Adventures.findById(id).populate('hints').exec().then(function (adventure, err) {
        if(err)
            res.send(err)
        if(adventure){
                var pistas;
                var hintadv = adventure.hints;
                //console.log('hintadv',hintadv);


                for (var i = 0; i < hintadv.length; i++){
                    console.log('fooooooooor');
                    var c_long = hintadv[i].location.coordinates[0];
                    var c_lat = hintadv[i].location.coordinates[1];
                    var test1 = geolib.isPointInCircle({latitude: lat, longitude: lon},
                        {latitude: c_lat, longitude: c_long},
                        20);

                    if (test1 == true) {
                        pistas = hintadv[i];
                        console.log('pistaaaasaaas' ,pistas);
                        res.send(pistas);
                    }
                    else {
                        console.log('false');
                    }
                }
        }
    });
});


router.post('/posicion/', function (req, res){

    var lat = req.body.latitude;
    var lon = req.body.longitude;
    var id =req.body.advid;

    Adventures.findById(id).populate('hints').exec().then(function (adventure, err) {
        if(err)
            res.send(err)
        if(adventure){
            var c_long = adventure.location.coordinates[0];
            var c_lat = adventure.location.coordinates[1];
            var posicion = geolib.isPointInCircle({latitude: lat, longitude: lon},
                {latitude: c_lat, longitude: c_long},
                20);
            console.log(c_long);
            console.log(c_lat);
            console.log(lon);
            console.log(lat);
            console.log(posicion);
            res.send(posicion);

        }
    });
});

router.post('/timeplayed/', function(req, res) {
    var query = {_id: req.body.adventure_id};
    var update = {$inc : {"played" : 1}};
    var options = {};

    Adventures.findOneAndUpdate(query, update, options, function(err, adventure) {
        if (err) {
            res.send(err);
        }
        console.log(adventure);
    });

    Adventures.find({_id: req.body.adventure_id}).deepPopulate(pathdeepPopulate).exec().then(function (err, adventure) {
        if(err)
            res.send(err)
        if (adventure)
        res.send(adventure);
    });
});

module.exports = router;

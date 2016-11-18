/**
 * Created by mbmarkus on 26/10/16.
 */

var express = require('express');
var mongoose = require('mongoose');
var Users = require('../models/modeluser');
var Adventures = require('../models/modeladventures');
var router = express.Router();
var geolib = new require('geolib');

// GET adventures in list
router.get('/', function(req, res) {

    Adventures.find(function (err, adventures) {
        if (err)
            res.send(err);
        res.json(adventures);
    });

});

// GET adventure by ID
router.get('/id/:adv_id', function(req, res){
    Adventures.findById(req.params.adv_id, function(err, adventure){
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
        Adventures.find(function (err, adventures) {
            if (err)
                res.send(err);
            res.json(adventures);
        });
    });
});

// Assign Adventure <--> User
router.post('/assignadventure/', function(req, res) {
    var query = {_id: req.body.user_id};
    var update = {$addToSet : {"adventures" : req.body.adventure_id}};
    var options = {};

    Users.findOneAndUpdate(query, update, options, function(err, user) {
        if (err) {
            res.send(err);
        }
        console.log(user);
    });

    Users.find({_id: req.body.user_id}).populate('adventures').exec().then(function (err, user) {
        if(err)
            res.send(err)
        res.json(user);
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

// Unassign Adventure <--> User
router.delete('/unassignadventure/', function (req, res) {

    var query = {_id: req.body.user_id};
    var update = {$pull : {"adventures" : req.body.adventure_id}};
    var options = {};

    Users.findOneAndUpdate(query, update, options, function(err, user) {
        if (err) {
            res.send(err)
        }
        res.send("Unassigned:" + req.body.adventure_id);
    });
});

router.post('/near', function (req, res){

    var lat = req.body.latitude;
    var lon = req.body.longitude;

    console.log(lat);
    console.log(lon);

    Adventures.find(function (err, adventures) {
        Adv = adventures;
        console.log("Adv");
        console.log(Adv.length);
        //console.log(Adv);
        var cercanas = [];
        for(i=0;i<Adv.length;i++){
           // console.log("enbuscadelascordenadasperdidas");
            var c_long = Adv[i].location.coordinates[0];
            var c_lat = Adv[i].location.coordinates[1];
            //console.log(c_lat);
            //console.log(c_long);
            if(
            geolib.isPointInCircle(
                {latitude: lat, longitude: lon},
                {latitude: c_lat, longitude: c_long},
                10000)==true){
                cercanas.push(Adv[i]);
                console.log(cercanas);
                //return cercanas;
                //res.send(cercanas);
                //cercanas=[];
                }else {console.log('false')}
            
        }

        res.send(cercanas);
    });


});


module.exports = router;

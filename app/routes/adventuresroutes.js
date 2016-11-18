/**
 * Created by mbmarkus on 26/10/16.
 */

var express = require('express');
var mongoose = require('mongoose');
var Users = require('../models/modeluser');
var Adventures = require('../models/modeladventures');
var router = express.Router();

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





module.exports = router;

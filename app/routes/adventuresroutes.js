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
    var query = {_id: req.params.user_id};
    var update = {$addToSet : {"adventures" : req.params.adventure_id}};
    var options = {};

    Users.findOneAndUpdate(query, update, options, function(err, user) {
        if (err) {
            res.send(err);
        }
        console.log(user);
    });

    Users.find({_id: req.params.user_id}).populate('adventures').exec().then(function (err, user) {
        if(err)
            res.send(err)
        res.json(user);
    });
});

// Delete Adventure & remove Adventure <--> User
router.delete('/removeadventure/:adventure_id', function(req, res) {

    Adventures.remove({
        _id : req.params.adventure_id
    }, function(err) {
        if (err)
            res.send(err)
    });

    Adventures.find(function (err, adventures) {
        if (err)
            res.send(err);
        res.json(adventures);
    });
});


module.exports = router;

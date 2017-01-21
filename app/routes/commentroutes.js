/**
 * Created by Andrea on 23/11/2016.
 */

var express = require('express');
var mongoose = require('mongoose');
var Adventures = require('../models/modeladventures');
var Comments = require('../models/modelcomment');
var User = require('../models/modeluser');
var router = express.Router();

//crear comentario
router.post('/:usr_id', function(req, res) {
    var text = req.body.text;
    var user = req.params.usr_id;
    Comments.create({
        text: text,
        user: user
    },function (err, comment) {
        if(comment){

            var query = {_id: req.params.usr_id};
            var update = {$inc : {"score": 1}};
            var options = {};

            User.findOneAndUpdate(query, update, options, function(err, user) {
                if (err) {
                    res.send(err);
                }
                if(user){
                    res.send(comment);
                }
            });
        }else{
            res.status(400).send("Error al crear el comentario")
        }
    });
    
});


//añadir comentario a aventura
router.post('/addtoadventure/:adv_id', function(req, res) {
    console.log(req.body._id);
    var query = {_id: req.params.adv_id};
    var update = {$addToSet : {"comments" : req.body._id}};
    var options = {};

    Adventures.findOneAndUpdate(query, update, options, function(err, adventure) {
        if (err) {
            res.send(err);
        }
        if (adventure){
            Adventures.findById(adventure._id).deepPopulate(['adventures.comments', 'comments.user']).exec().then(function (err, adventure) {
                if(err)
                    res.send(err)
                if(adventure)
                    console.log(adventure);
                    res.send(adventure);
            });
           /* Adventures.findById(adventure._id).deepPopulate(adventure, 'comments.user').exec().then(function (err, adventure) {
                if(err)
                    res.send(err)
                if(adventure)
                    console.log(adventure);
                res.send(adventure);

        });*/
    }
});
});



router.delete('/deletecomment/:cmt_id/:adv_id', function (req, res) {
    Comments.remove({
        _id: req.params.cmt_id
    },function (err, comment) {
        Adventures.findById(req.params.adv_id).deepPopulate(['adventures.comments', 'comments.user']).exec().then(function (err, adventure) {
            if(err)
                res.send(err)
            res.send(adventure);
        });
    });
});

module.exports = router;

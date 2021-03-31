var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var mongoose = require('../config/db-config');
var groupSchema = require('../models/groups');
const userSchema = require('../models/users');

var jwt = require('jsonwebtoken');
var { secret } = require('../config/config');
var kafka = require('../kafka/client');
var path = require('path');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;
var { secret } = require('../config/config')
var { auth, checkAuth } = require('../config/passport')
auth()
router.get('/groupbyid/:id', checkAuth, (req, res) => {
    console.log("hihihihihhihihiih");
    groupSchema.find({ _id: req.params.id }).then(docs => {
        console.log(docs);
        res.status(200).send(JSON.stringify(docs))
    }).catch(error => {
        res.status(400).send(error)
    })
});
router.post('/new', checkAuth, (req, res) => {
    console.log(req.body);
    console.log(req.body.selectedUsers.length);
    let newGroup = new groupSchema({
        userID: req.body.userID,
        groupName: req.body.groupName,
        timestamp: Date.now(),
        count: 1,
        image: req.body.updatedProfileImage,
        invitedBy : req.body.userName
    })
    newGroup.save().then(response => {
        console.log("Group Created successfully")
        console.log(response)
        let newGroupObjForInvitee = {
            groupID: response._id,
            groupName: req.body.groupName,
            invitedBy: "You"
        }
        userSchema.findByIdAndUpdate({ _id: req.body.userID }
            , { $push: { acceptedGroups: newGroupObjForInvitee } }, { new: true }
        ).then(doc => {
            for (let i = 0; i < req.body.selectedUsers.length; i++) {
                let newInvitation = {
                    groupID: response._id,
                    groupName: req.body.groupName,
                    invitedBy: req.body.userName,
                }
                userSchema.findByIdAndUpdate({ _id: req.body.selectedUsers[i].value }
                    , { $push: { invitedGroups: newInvitation } }, { new: true }
                ).then(doc => {
                    console.log("Group Invitation Added", doc)
                    res.status(200).send(doc);
                }).catch(error => {
                    console.log("error", error);
                    // res.status( 400 ).send( "Error following" );
                })
            }
            console.log("Group Invitation Added", doc)
            res.status(200).send(doc);
        }).catch(error => {
            console.log("error", error);
            // res.status( 400 ).send( "Error following" );
        })

        // res.status(200).send(obj)
    }).catch(error => {
        console.log("Error", error)
        res.status(400).send(error)
    })

});
router.put('/invite', checkAuth, (req, res) => {
    var userID = req.body.userID;
    var groupID = req.body.groupID;
    console.log(req.body);
    console.log(userID);
    console.log(groupID);
    if (req.body.type == 'accept') {
        console.log("Inside Accept");
            userSchema.findOneAndUpdate({ _id: userID }
                , { $pull: { invitedGroups: { groupID: req.body.groupID } } }, { new: true }
            ).then(doc => {
                console.log("Invited Group Removed", doc)
                let newInvitation = {
                    groupID: groupID,
                    groupName: req.body.groupName,
                    invitedBy: req.body.invitedBy,
                }
                userSchema.findOneAndUpdate({ _id: userID }
                    , { $push: { acceptedGroups: newInvitation } }, { new: true }
                ).then(doc => {
                    console.log("Group Added Successfully", doc)
                    groupSchema.findOneAndUpdate({ _id: groupID },
                        {
                            $inc: {
                                count: 1,
                            }
                        }
                    ).then(response => {
                        console.log("Update successful")
                        console.log(response);
                        res.status(200).send(response)
                    }).catch(error => {
                        console.log("Error in update", error)
                        res.status(400).send(error)
                    })
                    // res.status( 200 ).send( doc );
                }).catch(error => {
                    console.log("error", error);
                    // res.status( 400 ).send( "Error following" );
                })
            })
    }
    if (req.body.type == "ignore") {
        console.log("In ignore");
        userSchema.findOneAndUpdate({ _id: userID }
            , { $pull: { invitedGroups: { groupID: req.body.groupID } } }, { new: true }
        ).then(doc => {
            res.status(200).send(doc)
            console.log("Invited Group Removed", doc)
        }).catch(error => {
            console.log("error", error);
            res.status(400).send("Error");
        })
    }
});
module.exports = router;
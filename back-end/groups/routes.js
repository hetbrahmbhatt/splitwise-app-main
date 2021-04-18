var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var mongoose = require('../config/db-config');
var groupSchema = require('../models/groups');
const userSchema = require('../models/users');
const groupSummarySchema = require('../models/groupSummary');
const recentActivitySchema = require('../models/recentactivity')
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
        invitedBy: req.body.userName
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
            let membersSchema = {
                groupID: response._id,
                userID: req.body.userID,
                userName: req.body.userName
            }
            groupSchema.findByIdAndUpdate({ _id: response._id }
                , { $push: { membersSchema: membersSchema } }, { new: true }
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
                    }).catch(error => {
                        console.log("error", error);
                        // res.status( 400 ).send( "Error following" );
                    })
                }
                console.log("Group Invitation Added", doc)
                res.status(200).send(doc);
            })

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
                    let membersSchema = {
                        groupID: req.body.groupID,
                        userID: req.body.userID,
                        userName: req.body.userName
                    }
                    groupSchema.findOneAndUpdate({ _id: req.body.groupID }
                        , { $push: { membersSchema: membersSchema } }, { new: true }
                    ).then(doc => {

                    })
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
// get all users
router.put('/updategroup/', checkAuth, (req, res) => {
    console.log(req.body);
    groupSchema.findOneAndUpdate({ _id: req.body.groupID },
        {
            $set: {
                groupName: req.body.groupName,
            }
        }
    ).then(doc => {
        console.log("Update successful")
        console.log(doc);
        res.status(200).send(doc)
    }).catch(error => {
        console.log("Error in update", error)
        res.status(400).send(error)
    })
});
router.get('/groupsummarybyid/:id', checkAuth, (req, res) => {
    console.log(req.params.id)
    groupSummarySchema.find({ groupID: req.params.id }).sort({ createdAt: '-1' }).then(docs => {
        console.log("Group Summary by User", docs)
        res.status(200).send(docs)
    }).catch(error => {
        console.log("Error in Fetching Group Summary", error)
    })
});
router.put('/removemessage/', checkAuth, (req, res) => {
    console.log(req.body)
    groupSummarySchema.findOneAndUpdate({ _id: req.body.groupSummaryID }
        , { $pull: { messages: { _id: req.body.messageID } } }, { new: true }
    ).then(doc => {
        res.status(200).send(doc);
        console.log("Notes/Comments Delete", doc)
    }).catch(error => {
        console.log("error", error);
    })
});
router.put('/message', checkAuth, (req, res) => {
    console.log(req.body)
    const _id = ObjectId(req.body.groupSummaryID);
    var messageData = {
        name: req.body.userName,
        message: req.body.messageString
    }
    let newRecentActivity = new recentActivitySchema({
        userID: req.body.userID,
        payeeID: "",
        userName: req.body.userName,
        currency: "",
        groupID: "",
        groupName: req.body.groupName,
        description: "",
        amount: "",
        timestamp: "",
        settleflag: "",
        commentFlag: 1,
        message: req.body.messageString
    })
    const groupID = ObjectId(req.body.groupID);

    groupSchema.find({ _id: groupID }).then(doc => {
        console.log("Group DOCS", doc)
        console.log(doc[0].membersSchema)
        for (let i = 0; i < doc[0].membersSchema.length; i++) {
            if (doc[0].membersSchema[i].userID != req.body.userID) {
                let newActivity = new recentActivitySchema({
                    userID: doc[0].membersSchema[i].userID,
                    payeeID: "",
                    userName: req.body.userName,
                    currency: "",
                    groupID: "",
                    groupName: req.body.groupName,
                    description: "",
                    amount: "",
                    timestamp: "",
                    settleflag: "",
                    commentFlag: 1,
                    message: req.body.messageString
                })
                newActivity.save().then(response => {
                    console.log("Recent Activity Added successfully.")
                })
            }
        }
    }).catch(error => {
        console.log("Error in Fetching Group Summary", error)
    })

    newRecentActivity.save().then(response => {
        console.log("Recent Activity Added successfully.")
    })
    groupSummarySchema.findOneAndUpdate({ _id: _id }
        , { $push: { messages: messageData } }, { new: true }
    ).then(doc => {
        res.status(200).send(doc);
        console.log("Notes/Comments Added", doc)
    }).catch(error => {
        console.log("error", error);
    })
});
module.exports = router;
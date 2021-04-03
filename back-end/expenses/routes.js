var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var mongoose = require('../config/db-config');
var groupSchema = require('../models/groups');
const userSchema = require('../models/users');
const recentActivitySchema = require('../models/recentactivity');
const groupSummarySchema = require('../models/groupSummary');
var jwt = require('jsonwebtoken');
var { secret } = require('../config/config');
var kafka = require('../kafka/client');
var path = require('path');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;
var { secret } = require('../config/config')
var { auth, checkAuth } = require('../config/passport')
auth()
router.post('/new', checkAuth, (req, res) => {
    console.log(req.body)
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate().toString();
    let month = (date_ob.getMonth() + 1).toString();
    let year = date_ob.getFullYear().toString();
    let time = date_ob.getHours().toString() + "-" + date_ob.getMinutes().toString() + "-" + date_ob.getSeconds().toString();
    let timestamp = year + "-" + month + "-" + date + "-" + time;

    groupSchema.find({ _id: req.body.groupID },
    ).then(doc => {
        let totalGroupMembers = doc[0].membersSchema.length;
        let takingAmount = ((req.body.amount) / totalGroupMembers);
        var groupMembersminusone = totalGroupMembers - 1;
        let takingAmountForRecentActivity = (groupMembersminusone) * (req.body.amount / totalGroupMembers);
        let givingAmount = -1 * ((req.body.amount) / totalGroupMembers);
        for (let i = 0; i < doc[0].membersSchema.length; i++) {
            if (doc[0].membersSchema[i].userID == req.body.userID) {
                let newRecentActivity = new recentActivitySchema({
                    userID: doc[0].membersSchema[i].userID,
                    payeeID: req.body.userID,
                    userName: req.body.userName,
                    currency: req.body.currency,
                    groupID: req.body.groupID,
                    groupName: req.body.groupName,
                    description: req.body.description,
                    amount: takingAmountForRecentActivity,
                    timestamp: timestamp,
                    settleflag: 0
                })
                newRecentActivity.save().then(response => {
                    console.log("Recent Activity Created successfully")
                })
            }
            else {
                let newRecentActivity = new recentActivitySchema({
                    userID: doc[0].membersSchema[i].userID,
                    payeeID: req.body.userID,
                    userName: req.body.userName,
                    currency: req.body.currency,
                    groupID: req.body.groupID,
                    groupName: req.body.groupName,
                    description: req.body.description,
                    amount: givingAmount,
                    timestamp: timestamp,
                    settleflag: 0
                })
                newRecentActivity.save().then(response => {
                    console.log("Recent Activity Created successfully")
                })
            }

        }

        let groupSummary = new groupSummarySchema({
            userID: req.body.userID,
            userName: req.body.userName,
            currency: req.body.currency,
            groupID: req.body.groupID,
            groupName: req.body.groupName,
            description: req.body.description,
            amount: req.body.amount,
            settleFlag: 0
        })
        groupSummary.save().then(response => {
            console.log("Group Summary Saved successfully")
        })



















        console.log(takingAmount);
        console.log(givingAmount);
        for (let i = 0; i < doc[0].membersSchema.length; i++) {
            if (doc[0].membersSchema[i].userID == req.body.userID) {
                for (let i = 0; i < doc[0].membersSchema.length; i++) {
                    if (doc[0].membersSchema[i].userID != req.body.userID) {
                        let debts = {
                            userID: doc[0].membersSchema[i].userID,
                            userName: doc[0].membersSchema[i].userName,
                            currency: req.body.currency,
                            amount: takingAmount,
                            groupID: doc[0].membersSchema[i].groupID,
                            groupName: req.body.groupName,
                        }
                        userSchema.findOneAndUpdate({ _id: req.body.userID }
                            , { $push: { debts: debts } }, { new: true }
                        ).then(doc => {

                            // console.log("Logged in user", doc);
                        }).catch(error => {
                            console.log("Error in update", error)
                            // res.status(400).send(error)
                        })
                    }
                    else {
                        console.log("fsdkhfhuidruiiu", takingAmountForRecentActivity)
                        let recentActivity = {
                            userID: req.body.userID,
                            userName: req.body.userName,
                            currency: req.body.currency,
                            groupID: req.body.groupID,
                            groupName: req.body.groupName,
                            description: req.body.description,
                            amount: takingAmountForRecentActivity,
                            timestamp: timestamp,
                            settleflag: 0
                        }
                        userSchema.findOneAndUpdate({ _id: req.body.userID }
                            , { $push: { recentactivity: recentActivity } }, { new: true }
                        ).then(doc => {
                            console.log("Logged in user recent activity", doc)
                        })
                    }
                }
            }
            else {
                console.log("bjvhvhgcgfccgc", doc[0].membersSchema[i].userID)
                let recentActivity = {
                    userID: req.body.userID,
                    userName: req.body.userName,
                    currency: req.body.currency,
                    groupID: req.body.groupID,
                    groupName: req.body.groupName,
                    description: req.body.description,
                    amount: givingAmount,
                    timestamp: timestamp,
                    settleflag: 0
                }
                userSchema.findOneAndUpdate({ _id: doc[0].membersSchema[i].userID }
                    , { $push: { recentactivity: recentActivity } }, { new: true }
                ).then(doc => {
                    console.log("In user recent activity");
                    console.log("Others recent activity", doc)
                })
                console.log("Other Docs", doc);
                let debts = {
                    userID: doc[0].membersSchema[i].userID,
                    userName: req.body.userName,
                    currency: req.body.currency,
                    amount: givingAmount,
                    groupID: doc[0].membersSchema[i].groupID,
                    groupName: req.body.groupName,
                }
                console.log("huighuihuiui", doc[0].membersSchema[i].userID)
                userSchema.findOneAndUpdate({ _id: doc[0].membersSchema[i].userID }
                    , { $push: { debts: debts } }, { new: true }
                ).then(doc => {
                    // console.log("Other ID'S",doc[0].membersSchema[i].userID);

                    console.log("Over here nifhcnihfiedhfeiueiedi");

                }).catch(error => {
                    // res.status(400).send(error)
                })
            }
        }
    }).catch(error => {
        console.log(error);
        res.status(400).send(error)
    })
})
router.get('/recentactivity/:id', checkAuth, (req, res) => {
    console.log("Over here");
    console.log(req.params.id)
    recentActivitySchema.find({ userID: req.params.id }).sort({ timestamp: '-1' }).then(docs => {
        console.log("Recent Activity by User", docs)
        res.status(200).send(docs)
    }).catch(error => {
        console.log("Error in Recent Activity", error)
    })
});
module.exports = router;
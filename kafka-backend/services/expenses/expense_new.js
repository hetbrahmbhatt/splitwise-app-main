
const groupSchema = require('../../models/groups');
const DebtsSchema = require('../../models/debts');
const groupBalanceSchema = require('../../models/groupBalance');
const recentActivitySchema = require('../../models/recentactivity');
const userSchema = require('../../models/users');
const groupSummarySchema = require('../../models/groupSummary');
var ObjectId = require('mongodb').ObjectID;
function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    console.log("Response :-",req.body);
    groupSchema.find({ _id: req.body.groupID },
    ).then(doc => {
        let totalGroupMembers = doc[0].membersSchema.length;
        let takeAmount = Number((req.body.amount) / totalGroupMembers);
        if (Number.isInteger(takeAmount)) {

        }
        else {
            takeAmount = takeAmount.toString();
            takeAmount = takeAmount.slice(0, (takeAmount.indexOf(".")) + 3);
        }
        var groupMembersminusonee = totalGroupMembers - 1;
        let takingAmountForRecentActivitys = (groupMembersminusonee) * (req.body.amount / totalGroupMembers);
        if (Number.isInteger(takingAmountForRecentActivitys)) {

        }
        else {
            takingAmountForRecentActivitys = takingAmountForRecentActivitys.toString();
            takingAmountForRecentActivitys = takingAmountForRecentActivitys.slice(0, (takingAmountForRecentActivitys.indexOf(".")) + 3);
        }
        for (let i = 0; i < doc[0].membersSchema.length; i++) {
            if (doc[0].membersSchema[i].userID < req.body.userID) {
                DebtsSchema.find({
                    userID1: doc[0].membersSchema[i].userID,
                    userID2: req.body.userID,
                    groupID: req.body.groupID,
                    currency: req.body.currency,
                }).then(response => {

                    if (response.length == 0) {
                        let newDebts1 = new DebtsSchema({
                            userID1: doc[0].membersSchema[i].userID,
                            userID1Name: doc[0].membersSchema[i].userName,
                            userID2: req.body.userID,
                            userID2Name: req.body.userName,
                            groupID: req.body.groupID,
                            groupName: req.body.groupName,
                            currency: req.body.currency,
                            amount: takeAmount
                        })
                        newDebts1.save().then(response => {

                        })
                    }
                    else {

                        DebtsSchema.findOne(
                            { _id: ObjectId(response[0]._id) },
                        ).then(response1 => {

                            if (response1 == null) {

                            }
                            else {
                                let newAmount = Number(response1.amount) + Number(takeAmount);
                                newAmount = Number(newAmount);
                                DebtsSchema.findOneAndUpdate({ _id: ObjectId(response1._id) },
                                    {
                                        $set: {
                                            amount: newAmount,
                                        }
                                    }
                                ).then(resposne => {
                                })
                            }

                        })
                    }

                })

            }
            else if (doc[0].membersSchema[i].userID > req.body.userID) {
                DebtsSchema.find({
                    userID1: req.body.userID,
                    userID2: doc[0].membersSchema[i].userID,
                    groupID: req.body.groupID,
                    currency: req.body.currency,
                }).then(response => {
                    if (response.length == 0) {
                        let newDebts1 = new DebtsSchema({
                            userID1: req.body.userID,
                            userID1Name: req.body.userName,
                            userID2: doc[0].membersSchema[i].userID,
                            userID2Name: doc[0].membersSchema[i].userName,
                            groupID: req.body.groupID,
                            groupName: req.body.groupName,
                            currency: req.body.currency,
                            amount: -1 * takeAmount
                        })
                        newDebts1.save().then(response => {
                        })
                    }
                    else {
                        DebtsSchema.findOne(
                            { _id: ObjectId(response[0]._id) },
                        ).then(response1 => {

                            if (response1 == null) {

                            }
                            else {
                                takeAmount = Number(takeAmount);
                                let newAmount = response1.amount - (takeAmount);
                                newAmount = Number(newAmount);
                                DebtsSchema.findOneAndUpdate({ _id: ObjectId(response1._id) },
                                    {
                                        $set: {
                                            amount: newAmount,
                                        }
                                    }
                                ).then(resposne => {
                                })
                            }

                        })
                    }
                })
            }
        }
        for (let i = 0; i < doc[0].membersSchema.length; i++) {
            if (doc[0].membersSchema[i].userID != req.body.userID) {
                groupBalanceSchema.find({
                    userID: doc[0].membersSchema[i].userID,
                    groupID: req.body.groupID,
                    currency: req.body.currency,
                }).then(response => {
                    if (response.length == 0) {
                        let groupBalance = new groupBalanceSchema({
                            userID: doc[0].membersSchema[i].userID,
                            useerName: doc[0].membersSchema[i].userName,
                            groupID: req.body.groupID,
                            groupName: req.body.groupName,
                            amount: -1 * takeAmount,
                            currency: req.body.currency,
                        })
                        groupBalance.save().then(response => {
                        })
                    }
                    else {
                        groupBalanceSchema.findOne(
                            { _id: ObjectId(response[0]._id) },
                        ).then(response1 => {

                            let newy = Number(response1.amount) - Number(takeAmount);
                            groupBalanceSchema.findOneAndUpdate({ _id: ObjectId(response1._id) },
                                {
                                    $set: {
                                        amount: newy,
                                    }
                                }
                            ).then(resposne => {
                            })
                        })
                    }
                })

            }
            else if (doc[0].membersSchema[i].userID == req.body.userID) {
                groupBalanceSchema.find({
                    userID: doc[0].membersSchema[i].userID,
                    groupID: req.body.groupID,
                    currency: req.body.currency,
                }).then(response => {
                    if (response.length == 0) {
                        let groupBalance = new groupBalanceSchema({
                            userID: req.body.userID,
                            useerName: req.body.userName,
                            groupID: req.body.groupID,
                            groupName: req.body.groupName,
                            amount: takingAmountForRecentActivitys,
                            currency: req.body.currency,
                        })
                        groupBalance.save().then(response => {
                        })
                    }
                    else {
                        groupBalanceSchema.findOne(
                            { _id: ObjectId(response[0]._id) },
                        ).then(response1 => {
                            let newx = Number(response1.amount) + Number(takingAmountForRecentActivitys);
                            groupBalanceSchema.findOneAndUpdate({ _id: ObjectId(response1._id) },
                                {
                                    $set: {
                                        amount: newx,
                                    }
                                }
                            ).then(resposne => {
                            })
                        })
                    }
                })

            }
        }

    })
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
        })


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
                            // res.status(400).send(error)
                        })
                    }
                    else {
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
                        })
                    }
                }
            }
            else {
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
                })
                let debts = {
                    userID: doc[0].membersSchema[i].userID,
                    userName: req.body.userName,
                    currency: req.body.currency,
                    amount: givingAmount,
                    groupID: doc[0].membersSchema[i].groupID,
                    groupName: req.body.groupName,
                }
                userSchema.findOneAndUpdate({ _id: doc[0].membersSchema[i].userID }
                    , { $push: { debts: debts } }, { new: true }
                ).then(doc => {
                    // console.log("Other ID'S",doc[0].membersSchema[i].userID);
                    responsenew123.status(200).send(doc);

                }).catch(error => {
                    // res.status(400).send(error)
                })
            }
        }
    }).catch(error => {
        console.log(error);
        callback(error, null)
        // res.status(400).send(error)
    })
}

exports.handle_request = handle_request;
var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var mongoose = require('../config/db-config');
var groupSchema = require('../models/groups');
const userSchema = require('../models/users');
const recentActivitySchema = require('../models/recentactivity');
const groupSummarySchema = require('../models/groupSummary');
const DebtsSchema = require('../models/debts');
const groupBalanceSchema = require('../models/groupBalance');
var jwt = require('jsonwebtoken');
var { secret } = require('../config/config');
var kafka = require('../kafka/client');
var path = require('path');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;
var { secret } = require('../config/config')
var { auth, checkAuth } = require('../config/passport')
auth()
router.post('/new', checkAuth, (req, responsenew123) => {
    kafka.make_request('expense_new', req.body, function (err, results) {
        console.log(results)
        if (err) {
            responsenew123.status(400).send("Invalid Credentials")
        } else {
            responsenew123.status(200).send(results)
        }
    });
    // console.log(req.body);
    // groupSchema.find({ _id: req.body.groupID },
    // ).then(doc => {
    //     let totalGroupMembers = doc[0].membersSchema.length;
    //     console.log(req.body);
    //     let takeAmount = Number((req.body.amount) / totalGroupMembers);
    //     console.log(takeAmount);
    //     if (Number.isInteger(takeAmount)) {

    //     }
    //     else {
    //         takeAmount = takeAmount.toString();
    //         takeAmount = takeAmount.slice(0, (takeAmount.indexOf(".")) + 3);
    //     }
    //     console.log("Take Amount", takeAmount);
    //     var groupMembersminusonee = totalGroupMembers - 1;
    //     let takingAmountForRecentActivitys = (groupMembersminusonee) * (req.body.amount / totalGroupMembers);
    //     if (Number.isInteger(takingAmountForRecentActivitys)) {

    //     }
    //     else {
    //         takingAmountForRecentActivitys = takingAmountForRecentActivitys.toString();
    //         takingAmountForRecentActivitys = takingAmountForRecentActivitys.slice(0, (takingAmountForRecentActivitys.indexOf(".")) + 3);
    //     }
    //     for (let i = 0; i < doc[0].membersSchema.length; i++) {
    //         if (doc[0].membersSchema[i].userID < req.body.userID) {
    //             console.log("Over here in userfwefwfweffwfw");
    //             console.log(doc[0].membersSchema[i].userID);
    //             DebtsSchema.find({
    //                 userID1: doc[0].membersSchema[i].userID,
    //                 userID2: req.body.userID,
    //                 groupID: req.body.groupID,
    //                 currency: req.body.currency,
    //             }).then(response => {
    //                 console.log("Length of response", response.length);

    //                 if (response.length == 0) {
    //                     let newDebts1 = new DebtsSchema({
    //                         userID1: doc[0].membersSchema[i].userID,
    //                         userID1Name: doc[0].membersSchema[i].userName,
    //                         userID2: req.body.userID,
    //                         userID2Name: req.body.userName,
    //                         groupID: req.body.groupID,
    //                         groupName: req.body.groupName,
    //                         currency: req.body.currency,
    //                         amount: takeAmount
    //                     })
    //                     newDebts1.save().then(response => {
    //                         console.log("New Debts Saved")
    //                     })
    //                 }
    //                 else {
    //                     console.log("Here");

    //                     console.log("Response1234343", response);
    //                     console.log(response[0]);
    //                     console.log(response[0]._id);
    //                     DebtsSchema.findOne(
    //                         { _id: ObjectId(response[0]._id) },
    //                     ).then(response1 => {

    //                         if (response1 == null) {

    //                         }
    //                         else {
    //                             console.log("QERFEFEFEFEFREFEFEFRERFE", response1);
    //                             let newAmount = Number(response1.amount) + Number(takeAmount);
    //                             console.log(takeAmount);
    //                             console.log("newAmount", newAmount);
    //                             newAmount = Number(newAmount);
    //                             DebtsSchema.findOneAndUpdate({ _id: ObjectId(response1._id) },
    //                                 {
    //                                     $set: {
    //                                         amount: newAmount,
    //                                     }
    //                                 }
    //                             ).then(resposne => {
    //                                 console.log(resposne)
    //                             })
    //                         }

    //                     })
    //                 }

    //                 console.log("OIver cxedfwdfwdedsdedwdwddewdwdewedewdwsdwsdrw")
    //             })

    //         }
    //         else if (doc[0].membersSchema[i].userID > req.body.userID) {
    //             DebtsSchema.find({
    //                 userID1: req.body.userID,
    //                 userID2: doc[0].membersSchema[i].userID,
    //                 groupID: req.body.groupID,
    //                 currency: req.body.currency,
    //             }).then(response => {
    //                 console.log("Length of response", response.length);
    //                 if (response.length == 0) {
    //                     let newDebts1 = new DebtsSchema({
    //                         userID1: req.body.userID,
    //                         userID1Name: req.body.userName,
    //                         userID2: doc[0].membersSchema[i].userID,
    //                         userID2Name: doc[0].membersSchema[i].userName,
    //                         groupID: req.body.groupID,
    //                         groupName: req.body.groupName,
    //                         currency: req.body.currency,
    //                         amount: -1 * takeAmount
    //                     })
    //                     newDebts1.save().then(response => {
    //                         console.log("New Debts Saved")
    //                     })
    //                 }
    //                 else {
    //                     console.log("Here");

    //                     console.log("Response1234343", response);
    //                     console.log(response[0]);
    //                     console.log(response[0]._id);
    //                     DebtsSchema.findOne(
    //                         { _id: ObjectId(response[0]._id) },
    //                     ).then(response1 => {

    //                         if (response1 == null) {

    //                         }
    //                         else {
    //                             console.log("QERFEFEFEFEFREFEFEFRERFE", response1);
    //                             console.log(takeAmount);
    //                             takeAmount = Number(takeAmount);
    //                             let newAmount = response1.amount - (takeAmount);
    //                             newAmount = Number(newAmount);
    //                             DebtsSchema.findOneAndUpdate({ _id: ObjectId(response1._id) },
    //                                 {
    //                                     $set: {
    //                                         amount: newAmount,
    //                                     }
    //                                 }
    //                             ).then(resposne => {
    //                                 console.log(resposne)
    //                             })
    //                         }

    //                     })
    //                 }

    //                 console.log("OIver cxedfwdfwdedsdedwdwddewdwdewedewdwsdwsdrw")
    //             })
    //         }
    //     }
    //     for (let i = 0; i < doc[0].membersSchema.length; i++) {
    //         if (doc[0].membersSchema[i].userID != req.body.userID) {
    //             groupBalanceSchema.find({
    //                 userID: doc[0].membersSchema[i].userID,
    //                 groupID: req.body.groupID,
    //                 currency: req.body.currency,
    //             }).then(response => {
    //                 if (response.length == 0) {
    //                     let groupBalance = new groupBalanceSchema({
    //                         userID: doc[0].membersSchema[i].userID,
    //                         useerName: doc[0].membersSchema[i].userName,
    //                         groupID: req.body.groupID,
    //                         groupName: req.body.groupName,
    //                         amount: -1 * takeAmount,
    //                         currency: req.body.currency,
    //                     })
    //                     groupBalance.save().then(response => {
    //                     })
    //                 }
    //                 else {
    //                     groupBalanceSchema.findOne(
    //                         { _id: ObjectId(response[0]._id) },
    //                     ).then(response1 => {

    //                         let newy = Number(response1.amount) - Number(takeAmount);
    //                         groupBalanceSchema.findOneAndUpdate({ _id: ObjectId(response1._id) },
    //                             {
    //                                 $set: {
    //                                     amount: newy,
    //                                 }
    //                             }
    //                         ).then(resposne => {
    //                         })
    //                     })
    //                 }
    //             })

    //         }
    //         else if (doc[0].membersSchema[i].userID == req.body.userID) {
    //             groupBalanceSchema.find({
    //                 userID: doc[0].membersSchema[i].userID,
    //                 groupID: req.body.groupID,
    //                 currency: req.body.currency,
    //             }).then(response => {
    //                 console.log(response);
    //                 if (response.length == 0) {
    //                     let groupBalance = new groupBalanceSchema({
    //                         userID: req.body.userID,
    //                         useerName: req.body.userName,
    //                         groupID: req.body.groupID,
    //                         groupName: req.body.groupName,
    //                         amount: takingAmountForRecentActivitys,
    //                         currency: req.body.currency,
    //                     })
    //                     groupBalance.save().then(response => {
    //                         console.log("Group Balance  opposite Saved")
    //                     })
    //                 }
    //                 else {
    //                     groupBalanceSchema.findOne(
    //                         { _id: ObjectId(response[0]._id) },
    //                     ).then(response1 => {
    //                         let newx = Number(response1.amount) + Number(takingAmountForRecentActivitys);
    //                         groupBalanceSchema.findOneAndUpdate({ _id: ObjectId(response1._id) },
    //                             {
    //                                 $set: {
    //                                     amount: newx,
    //                                 }
    //                             }
    //                         ).then(resposne => {
    //                             console.log(resposne)
    //                         })
    //                     })
    //                 }
    //                 console.log("Group Balance Response", response);
    //             })

    //         }
    //     }

    // })
    // console.log(req.body)
    // let ts = Date.now();
    // let date_ob = new Date(ts);
    // let date = date_ob.getDate().toString();
    // let month = (date_ob.getMonth() + 1).toString();
    // let year = date_ob.getFullYear().toString();
    // let time = date_ob.getHours().toString() + "-" + date_ob.getMinutes().toString() + "-" + date_ob.getSeconds().toString();
    // let timestamp = year + "-" + month + "-" + date + "-" + time;

    // groupSchema.find({ _id: req.body.groupID },
    // ).then(doc => {
    //     let totalGroupMembers = doc[0].membersSchema.length;
    //     let takingAmount = ((req.body.amount) / totalGroupMembers);

    //     var groupMembersminusone = totalGroupMembers - 1;
    //     let takingAmountForRecentActivity = (groupMembersminusone) * (req.body.amount / totalGroupMembers);
    //     let givingAmount = -1 * ((req.body.amount) / totalGroupMembers);
    //     for (let i = 0; i < doc[0].membersSchema.length; i++) {
    //         if (doc[0].membersSchema[i].userID == req.body.userID) {
    //             let newRecentActivity = new recentActivitySchema({
    //                 userID: doc[0].membersSchema[i].userID,
    //                 payeeID: req.body.userID,
    //                 userName: req.body.userName,
    //                 currency: req.body.currency,
    //                 groupID: req.body.groupID,
    //                 groupName: req.body.groupName,
    //                 description: req.body.description,
    //                 amount: takingAmountForRecentActivity,
    //                 timestamp: timestamp,
    //                 settleflag: 0
    //             })
    //             newRecentActivity.save().then(response => {
    //                 console.log("Recent Activity Created successfully")
    //             })
    //         }
    //         else {
    //             let newRecentActivity = new recentActivitySchema({
    //                 userID: doc[0].membersSchema[i].userID,
    //                 payeeID: req.body.userID,
    //                 userName: req.body.userName,
    //                 currency: req.body.currency,
    //                 groupID: req.body.groupID,
    //                 groupName: req.body.groupName,
    //                 description: req.body.description,
    //                 amount: givingAmount,
    //                 timestamp: timestamp,
    //                 settleflag: 0
    //             })
    //             newRecentActivity.save().then(response => {
    //                 console.log("Recent Activity Created successfully")
    //             })
    //         }

    //     }

    //     let groupSummary = new groupSummarySchema({
    //         userID: req.body.userID,
    //         userName: req.body.userName,
    //         currency: req.body.currency,
    //         groupID: req.body.groupID,
    //         groupName: req.body.groupName,
    //         description: req.body.description,
    //         amount: req.body.amount,
    //         settleFlag: 0
    //     })
    //     groupSummary.save().then(response => {
    //         console.log("Group Summary Saved successfully")
    //     })


    //     for (let i = 0; i < doc[0].membersSchema.length; i++) {
    //         if (doc[0].membersSchema[i].userID == req.body.userID) {
    //             for (let i = 0; i < doc[0].membersSchema.length; i++) {
    //                 if (doc[0].membersSchema[i].userID != req.body.userID) {
    //                     let debts = {
    //                         userID: doc[0].membersSchema[i].userID,
    //                         userName: doc[0].membersSchema[i].userName,
    //                         currency: req.body.currency,
    //                         amount: takingAmount,
    //                         groupID: doc[0].membersSchema[i].groupID,
    //                         groupName: req.body.groupName,
    //                     }
    //                     userSchema.findOneAndUpdate({ _id: req.body.userID }
    //                         , { $push: { debts: debts } }, { new: true }
    //                     ).then(doc => {

    //                         // console.log("Logged in user", doc);
    //                     }).catch(error => {
    //                         console.log("Error in update", error)
    //                         // res.status(400).send(error)
    //                     })
    //                 }
    //                 else {
    //                     console.log("fsdkhfhuidruiiu", takingAmountForRecentActivity)
    //                     let recentActivity = {
    //                         userID: req.body.userID,
    //                         userName: req.body.userName,
    //                         currency: req.body.currency,
    //                         groupID: req.body.groupID,
    //                         groupName: req.body.groupName,
    //                         description: req.body.description,
    //                         amount: takingAmountForRecentActivity,
    //                         timestamp: timestamp,
    //                         settleflag: 0
    //                     }
    //                     userSchema.findOneAndUpdate({ _id: req.body.userID }
    //                         , { $push: { recentactivity: recentActivity } }, { new: true }
    //                     ).then(doc => {
    //                         console.log("Logged in user recent activity", doc)
    //                     })
    //                 }
    //             }
    //         }
    //         else {
    //             console.log("bjvhvhgcgfccgc", doc[0].membersSchema[i].userID)
    //             let recentActivity = {
    //                 userID: req.body.userID,
    //                 userName: req.body.userName,
    //                 currency: req.body.currency,
    //                 groupID: req.body.groupID,
    //                 groupName: req.body.groupName,
    //                 description: req.body.description,
    //                 amount: givingAmount,
    //                 timestamp: timestamp,
    //                 settleflag: 0
    //             }
    //             userSchema.findOneAndUpdate({ _id: doc[0].membersSchema[i].userID }
    //                 , { $push: { recentactivity: recentActivity } }, { new: true }
    //             ).then(doc => {
    //                 console.log("In user recent activity");
    //                 console.log("Others recent activity", doc)
    //             })
    //             console.log("Other Docs", doc);
    //             let debts = {
    //                 userID: doc[0].membersSchema[i].userID,
    //                 userName: req.body.userName,
    //                 currency: req.body.currency,
    //                 amount: givingAmount,
    //                 groupID: doc[0].membersSchema[i].groupID,
    //                 groupName: req.body.groupName,
    //             }
    //             console.log("huighuihuiui", doc[0].membersSchema[i].userID)
    //             userSchema.findOneAndUpdate({ _id: doc[0].membersSchema[i].userID }
    //                 , { $push: { debts: debts } }, { new: true }
    //             ).then(doc => {
    //                 // console.log("Other ID'S",doc[0].membersSchema[i].userID);
    //                 responsenew123.status(200).send(doc);
    //                 console.log("Over here nifhcnihfiedhfeiueiedi");

    //             }).catch(error => {
    //                 // res.status(400).send(error)
    //             })
    //         }
    //     }
    // }).catch(error => {
    //     console.log(error);
    //     res.status(400).send(error)
    // })
})
router.post('/totalgiving/:id', checkAuth, (req, res) => {
    console.log("ID", req.params.id);
    kafka.make_request('expense_get_totalgiving', req.params, function (err, results) {
        console.log('in group By create results');
        console.log(results)
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
    // DebtsSchema.find({
    //     $or: [
    //         {
    //             userID2: req.params.id,
    //             amount: { $lt: 0 }
    //         },
    //         {
    //             userID1: req.params.id,
    //             amount: { $gt: 0 }
    //         }
    //     ]
    // }).then(docs => {
    //     console.log(docs)
    //     res.status(200).send(JSON.stringify(docs))
    // });
});

router.post('/totalowing/:id', checkAuth, (req, res) => {
    console.log("ID", req.params.id);
    kafka.make_request('expense_get_totalowing', req.params, function (err, results) {
        console.log('in group By create results');
        console.log(results)
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
    // DebtsSchema.find({
    //     $or: [
    //         {
    //             userID1: req.params.id,
    //             amount: { $lt: 0 }
    //         },
    //         {
    //             userID2: req.params.id,
    //             amount: { $gt: 0 }
    //         }
    //     ]

    // }).then(docs => {
    //     console.log(docs)
    //     res.status(200).send(JSON.stringify(docs))
    // });
});
router.get('/totalinternaldebt/:id', checkAuth, (req, res) => {

    var groupID = req.params.id;
    kafka.make_request('expense_get_totalinternaldebt', req.params, function (err, results) {
        console.log('in group By create results');
        console.log(results)
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
    // console.log("In total ");
    // DebtsSchema.find({ groupID: groupID }).then(docs => {
    //     console.log(docs);
    //     res.status(200).send(docs)
    // });
})
router.post('/givingsettleup', checkAuth, (req, response123) => {
    console.log("Over herre");
    console.log(req.body)
    kafka.make_request('expense_giving_settleup', req.body, function (err, results) {
        console.log('in group By create results');
        console.log(results)
        if (err) {
            console.log("Inside err");
            response123.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            response123.status(200).send(results)
        }
    });
    // groupSchema.find({ _id: req.body.groupID },
    // ).then(doc => {
    //     for (let i = 0; i < doc[0].membersSchema.length; i++) {
    //         let recentActivity = new recentActivitySchema({
    //             userID: doc[0].membersSchema[i].userID,
    //             groupID: req.body.groupID,
    //             userName: req.body.userName + " and " + req.body.sessionName + " settled up",
    //             currency: req.body.currency,
    //             groupName: req.body.groupName,
    //             amount: req.body.amount,
    //             settleflag: 100
    //         })
    //         recentActivity.save().then(response => {
    //             console.log(response);
    //             console.log("Response saved Successfully");
    //         })
    //     }
    // })
    // let amountToUpdate = 0;
    // if (Number(req.body.amount) > 0) {
    //     amountToUpdate = req.body.amount;
    // }
    // else {
    //     amountToUpdate = -1 * (req.body.amount);
    // }
    // DebtsSchema.findOneAndUpdate({ _id: ObjectId(req.body.debtID) },
    //     {
    //         $set: {
    //             amount: 0,
    //         }
    //     }
    // ).then(response => {
    //     console.log("Here is the response", response)
    //     groupBalanceSchema.find(
    //         {
    //             userID: req.body.sessionID,
    //             groupID: req.body.groupID,
    //             currency: req.body.currency
    //         }
    //     ).then(res => {
    //         console.log("Response is", res[0]._id);
    //         console.log("here");
    //         let newamount = res[0].amount;
    //         newamount = Number(newamount) + Number(amountToUpdate);
    //         console.log(res._id);
    //         groupBalanceSchema.findOneAndUpdate(
    //             { _id: ObjectId(res[0]._id) },
    //             {
    //                 amount: newamount
    //             }
    //         ).then(resposne => {
    //             console.log("G1 updated successfully")
    //             if (resposne != null) {
    //                 groupBalanceSchema.find(
    //                     {
    //                         userID: req.body.userid,
    //                         groupID: req.body.groupID,
    //                         currency: req.body.currency
    //                     }
    //                 ).then(res => {
    //                     console.log("G2 updated successfully")
    //                     let newamount = res[0].amount;
    //                     newamount = Number(newamount) - Number(amountToUpdate)
    //                     groupBalanceSchema.findOneAndUpdate(
    //                         { _id: ObjectId(res[0]._id) },
    //                         {
    //                             amount: newamount
    //                         }
    //                     ).then(response => {
    //                         response123.status(200).send(response);
    //                     })
    //                 }
    //                 )
    //             }
    //         })
    //     }).catch(error => {

    //     })
    // })

})

router.post('/owingsettleup', checkAuth, (req, response123) => {
    console.log("owing settle ")
    kafka.make_request('expense_owing_settleup', req.body, function (err, results) {
        console.log('in group By create results');
        console.log(results)
        if (err) {
            console.log("Inside err");
            response123.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            response123.status(200).send(results)
        }
    });
    // groupSchema.find({ _id: req.body.groupID },
    // ).then(doc => {
    //     for (let i = 0; i < doc[0].membersSchema.length; i++) {
    //         let recentActivity = new recentActivitySchema({
    //             userID: doc[0].membersSchema[i].userID,
    //             groupID: req.body.groupID,
    //             userName: req.body.userName + " and " + req.body.sessionName + " settled up",
    //             currency: req.body.currency,
    //             groupName: req.body.groupName,
    //             amount: req.body.amount,
    //             settleflag: 100
    //         })
    //         recentActivity.save().then(response => {
    //             console.log(response);
    //             console.log("Response saved Successfully");
    //         })
    //     }
    // })
    // let amountToUpdate = 0;
    // if (Number(req.body.amount) > 0) {
    //     amountToUpdate = req.body.amount;
    // }
    // else {
    //     amountToUpdate = -1 * (req.body.amount);
    // }
    // DebtsSchema.findOneAndUpdate({ _id: ObjectId(req.body.debtID) },
    //     {
    //         $set: {
    //             amount: 0,
    //         }
    //     }
    // ).then(response => {
    //     console.log("Here is the response", response)
    //     groupBalanceSchema.find(
    //         {
    //             userID: req.body.sessionID,
    //             groupID: req.body.groupID,
    //             currency: req.body.currency
    //         }
    //     ).then(res => {
    //         console.log("Response is", res[0]._id);
    //         console.log("here");
    //         let newamount = res[0].amount;
    //         newamount = Number(newamount) - Number(amountToUpdate);
    //         console.log(res._id);
    //         groupBalanceSchema.findOneAndUpdate(
    //             { _id: ObjectId(res[0]._id) },
    //             {
    //                 amount: newamount
    //             }
    //         ).then(resposne => {
    //             console.log("G1 updated successfully")
    //             if (resposne != null) {
    //                 groupBalanceSchema.find(
    //                     {
    //                         userID: req.body.userid,
    //                         groupID: req.body.groupID,
    //                         currency: req.body.currency
    //                     }
    //                 ).then(res => {
    //                     console.log("G2 updated successfully")
    //                     let newamount = res[0].amount;
    //                     newamount = Number(newamount) + Number(amountToUpdate)
    //                     groupBalanceSchema.findOneAndUpdate(
    //                         { _id: ObjectId(res[0]._id) },
    //                         {
    //                             amount: newamount
    //                         }
    //                     ).then(response => {
    //                         response123.status(200).send(response);
    //                     })
    //                 }
    //                 )
    //             }
    //         })
    //     }).catch(error => {

    //     })
    // })

})

router.post('/recentactivity', checkAuth, (req, res) => {


    kafka.make_request('expense_filter_recentActivity', req.body, function (err, results) {
        console.log('in group By create results');
        console.log(results)
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
    // console.log("Over here in recent activity");
    // console.log(req.body);
    // if (req.body.orderByFlag && req.body.activitiesFlag) {
    //     recentActivitySchema.find({ userID: req.body.userID, groupID: req.body.groupID }).sort({ createdAt: req.body.orderBy }).then(docs => {
    //         console.log("Recent Activity by User in Activitiees Flag valur", docs)
    //         res.status(200).send(docs)
    //     }).catch(error => {
    //         console.log("Error in Recent Activity", error)
    //     })
    // }
    // else if (req.body.orderByFlag && !req.body.activitiesFlag) {
    //     recentActivitySchema.find({ userID: req.body.userID }).sort({ createdAt: req.body.createdAt }).then(docs => {
    //         res.status(200).send(docs)
    //     }).catch(error => {
    //         console.log("Error in Recent Activity", error)
    //     })
    // }
    // else if (req.body.activitiesFlag) {
    //     console.log("Recent Activity by User in Activitiees Flag valur")
    //     recentActivitySchema.find({ userID: req.body.userID, groupID: req.body.groupIDSelected }).sort({ createdAt: '-1' }).then(docs => {
    //         console.log("Recent Activity by User in Activitiees Flag valur", docs)
    //         res.status(200).send(docs)
    //     }).catch(error => {
    //         console.log("Error in Recent Activity", error)
    //     })
    //     console.log("over herere rer")
    // }
    // else {
    //     recentActivitySchema.find({ userID: req.body.userID }).sort({ createdAt: '-1' }).then(docs => {
    //         console.log("Recent Activity by User", docs)
    //         res.status(200).send(docs)
    //     }).catch(error => {
    //         console.log("Error in Recent Activity", error)
    //     })
    // }
});
router.get('/postotalbalance/:id', (req, res) => {
    console.log("ID isisisi", req.params.id);
    kafka.make_request('expense_get_positivetotalbalance', req.body, function (err, results) {
        console.log('in group By create results');
        console.log(results)
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
    // console.log(req.body);
    // groupBalanceSchema.aggregate(
    //     [
    //         // First Stage
    //         {
    //             $match: {
    //                 userID: req.params.id,

    //                 amount: { $gt: 0 }
    //             }
    //         },
    //         {
    //             $group:
    //             {
    //                 _id: "$currency",
    //                 amount: { $sum: "$amount" }
    //             }
    //         },
    //     ]
    // ).then(response => {
    //     console.log("here");
    //     console.log(response);
    //     res.status(200).send(JSON.stringify(response));
    // })
})

router.post('/internalgroupbalance', (req, res) => {
    console.log(req.body);
    console.log("over here in internalgroupbalance")
    kafka.make_request('expense_get_totalinternalbalance', req.body, function (err, results) {
        console.log('in group By create results');
        console.log(results)
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
    // groupBalanceSchema.find({
    //     groupID: req.body.groupID,
    // }).then(response => {
    //     res.status(200).send(JSON.stringify(response))
    // })

    // groupBalanceSchema.aggregate(
    //     [
    //         // First Stage
    //         {
    //             $match: {
    //                 userID: req.params.id,

    //                 amount: { $gt: 0 }
    //             }
    //         },
    //         {
    //             $group:
    //             {
    //                 _id: "$currency",
    //                 amount: { $sum: "$amount" }
    //             }
    //         },
    //     ]
    // ).then(response => {
    //     console.log("here");
    //     console.log(response);
    //     res.status(200).send(JSON.stringify(response));
    // })
})

module.exports = router;

const DebtsSchema = require('../../models/debts');
const groupSchema = require('../../models/groups');
const groupBalanceSchema = require('../../models/groupBalance');
const recentActivitySchema = require('../../models/recentactivity');
const userSchema = require('../../models/users');
const groupSummarySchema = require('../../models/groupSummary');
var ObjectId = require('mongodb').ObjectID;
function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    console.log("Over here in recent activity");
    console.log(req.body);
    if (req.body.orderByFlag && req.body.activitiesFlag) {
        recentActivitySchema.find({ userID: req.body.userID, groupID: req.body.groupID }).sort({ createdAt: req.body.orderBy }).then(docs => {
            console.log("Recent Activity by User in Activitiees Flag valur", docs)
            callback(null, docs)

            // res.status(200).send(docs)
        }).catch(error => {
            console.log("Error in Recent Activity", error)
        })
    }
    else if (req.body.orderByFlag && !req.body.activitiesFlag) {
        recentActivitySchema.find({ userID: req.body.userID }).sort({ createdAt: req.body.createdAt }).then(docs => {
            callback(null, docs)

            // res.status(200).send(docs)
        }).catch(error => {
            console.log("Error in Recent Activity", error)
        })
    }
    else if (req.body.activitiesFlag) {
        console.log("Recent Activity by User in Activitiees Flag valur")
        recentActivitySchema.find({ userID: req.body.userID, groupID: req.body.groupIDSelected }).sort({ createdAt: '-1' }).then(docs => {
            console.log("Recent Activity by User in Activitiees Flag valur", docs)
            callback(null, docs)

            // res.status(200).send(docs)
        }).catch(error => {
            console.log("Error in Recent Activity", error)
        })
        console.log("over herere rer")
    }
    else {
        recentActivitySchema.find({ userID: req.body.userID }).sort({ createdAt: '-1' }).then(docs => {
            console.log("Recent Activity by User", docs)
            callback(null, docs)

            // res.status(200).send(docs)
        }).catch(error => {
            console.log("Error in Recent Activity", error)
        })
    }
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
    //                         callback(null, response)
    //                         // response123.status(200).send(response);
    //                     })
    //                 }
    //                 )
    //             }
    //         })
    //     }).catch(error => {

    //     })
    // })

}

exports.handle_request = handle_request;
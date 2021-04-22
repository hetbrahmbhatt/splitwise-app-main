
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
    groupSchema.find({ _id: req.body.groupID },
    ).then(doc => {
        for (let i = 0; i < doc[0].membersSchema.length; i++) {
            let recentActivity = new recentActivitySchema({
                userID: doc[0].membersSchema[i].userID,
                groupID: req.body.groupID,
                userName: req.body.userName + " and " + req.body.sessionName + " settled up",
                currency: req.body.currency,
                groupName: req.body.groupName,
                amount: req.body.amount,
                settleflag: 100
            })
            recentActivity.save().then(response => {
                console.log(response);
                console.log("Response saved Successfully");
            })
        }
    })
    let amountToUpdate = 0;
    if (Number(req.body.amount) > 0) {
        amountToUpdate = req.body.amount;
    }
    else {
        amountToUpdate = -1 * (req.body.amount);
    }
    DebtsSchema.findOneAndUpdate({ _id: ObjectId(req.body.debtID) },
        {
            $set: {
                amount: 0,
            }
        }
    ).then(response => {
        console.log("Here is the response", response)
        groupBalanceSchema.find(
            {
                userID: req.body.sessionID,
                groupID: req.body.groupID,
                currency: req.body.currency
            }
        ).then(res => {
            let newamount = res[0].amount;
            newamount = Number(newamount) + Number(amountToUpdate);
            console.log(res._id);
            groupBalanceSchema.findOneAndUpdate(
                { _id: ObjectId(res[0]._id) },
                {
                    amount: newamount
                }
            ).then(resposne => {
                console.log("G1 updated successfully")
                if (resposne != null) {
                    groupBalanceSchema.find(
                        {
                            userID: req.body.userid,
                            groupID: req.body.groupID,
                            currency: req.body.currency
                        }
                    ).then(res => {
                        console.log("G2 updated successfully")
                        let newamount = res[0].amount;
                        newamount = Number(newamount) - Number(amountToUpdate)
                        groupBalanceSchema.findOneAndUpdate(
                            { _id: ObjectId(res[0]._id) },
                            {
                                amount: newamount
                            }
                        ).then(response => {
                            callback(null, response)
                            // response123.status(200).send(response);
                        })
                    }
                    )
                }
            })
        }).catch(error => {

        })
    })

}

exports.handle_request = handle_request;
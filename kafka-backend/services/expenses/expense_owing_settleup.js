
const DebtsSchema = require('../../models/debts');
const groupSchema = require('../../models/groups');
const groupBalanceSchema = require('../../models/groupBalance');
const recentActivitySchema = require('../../models/recentactivity');

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
        groupBalanceSchema.find(
            {
                userID: req.body.sessionID,
                groupID: req.body.groupID,
                currency: req.body.currency
            }
        ).then(res => {
            let newamount = res[0].amount;
            newamount = Number(newamount) - Number(amountToUpdate);
            console.log(res._id);
            groupBalanceSchema.findOneAndUpdate(
                { _id: ObjectId(res[0]._id) },
                {
                    amount: newamount
                }
            ).then(response => {
                if (response != null) {
                    groupBalanceSchema.find(
                        {
                            userID: req.body.userid,
                            groupID: req.body.groupID,
                            currency: req.body.currency
                        }
                    ).then(res => {
                        let newamount = res[0].amount;
                        newamount = Number(newamount) + Number(amountToUpdate)
                        groupBalanceSchema.findOneAndUpdate(
                            { _id: ObjectId(res[0]._id) },
                            {
                                amount: newamount
                            }
                        ).then(response => {
                            callback(null, response)
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
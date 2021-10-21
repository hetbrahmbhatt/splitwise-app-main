var ObjectId = require('mongodb').ObjectID;
const recentActivitySchema = require('../../models/recentactivity');
const groupSchema = require('../../models/groups');
const groupSummarySchema = require('../../models/groupSummary');

function handle_request(msg, callback) {
    let req = {
        body: msg
    }
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

    groupSchema.find({ _id: req.body.groupID }).then(doc => {
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
                })
            }
        }
    }).catch(error => {
    })

    newRecentActivity.save().then(response => {
    })
    groupSummarySchema.findOneAndUpdate({ _id: _id }
        , { $push: { messages: messageData } }, { new: true }
    ).then(doc => {
        callback(null, doc)
    }).catch(error => {
        callback(error, null)
    })
}

exports.handle_request = handle_request;
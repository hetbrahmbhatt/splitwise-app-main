const userSchema = require('../../models/users');
var ObjectId = require('mongodb').ObjectID;
const recentActivitySchema = require('../../models/recentactivity');
const groupSchema = require('../../models/groups');
const groupSummarySchema = require('../../models/groupSummary');

function handle_request(msg, callback) {
    let req = {
        body: msg
    }
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

    groupSchema.find({ _id: req.body.groupID }).then(doc => {
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
        callback(null, doc)
        console.log("Notes/Comments Added", doc)
    }).catch(error => {
        callback(error, null)
    })
}

exports.handle_request = handle_request;
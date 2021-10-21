
const recentActivitySchema = require('../../models/recentactivity');
function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    if (req.body.orderByFlag && req.body.activitiesFlag) {
        recentActivitySchema.find({ userID: req.body.userID, groupID: req.body.groupID }).sort({ createdAt: req.body.orderBy }).then(docs => {
            callback(null, docs)
        }).catch(error => {
        })
    }
    else if (req.body.orderByFlag && !req.body.activitiesFlag) {
        recentActivitySchema.find({ userID: req.body.userID }).sort({ createdAt: req.body.createdAt }).then(docs => {
            callback(null, docs)
        }).catch(error => {
        })
    }
    else if (req.body.activitiesFlag) {
        recentActivitySchema.find({ userID: req.body.userID, groupID: req.body.groupIDSelected }).sort({ createdAt: '-1' }).then(docs => {
            callback(null, docs)
        }).catch(error => {

        })
    }
    else {
        recentActivitySchema.find({ userID: req.body.userID }).sort({ createdAt: '-1' }).then(docs => {
            callback(null, docs)
        }).catch(error => {
            console.log("Error in Recent Activity", error)
        })
    }
}

exports.handle_request = handle_request;
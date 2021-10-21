
const debtsSchema = require('../../models/groups');
const userSchema = require('../../models/users');
const groupSummarySchema = require('../../models/groupSummary');

function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    groupSummarySchema.findOneAndUpdate({ _id: req.body.groupSummaryID }
        , { $pull: { messages: { _id: req.body.messageID } } }, { new: true }
    ).then(doc => {
        callback(null, doc)

    }).catch(error => {
        callback(error, null)
    })
}

exports.handle_request = handle_request;
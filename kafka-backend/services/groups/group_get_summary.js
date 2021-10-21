const groupSummarySchema = require('../../models/groupSummary');

function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    // get group summary in descending order
    groupSummarySchema.find({ groupID: req.params.id }).sort({ createdAt: '-1' }).then(docs => {
        callback(null, docs)
    }).catch(error => {
        callback(error, null)
    })
}

exports.handle_request = handle_request;
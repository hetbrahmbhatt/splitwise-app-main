
const debtsSchema = require('../../models/debts');

const groupSummarySchema = require('../../models/groupSummary');

function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    groupSummarySchema.find({ groupID: req.params.id }).sort({ createdAt: '-1' }).then(docs => {
        console.log("Group Summary by User", docs)
        callback(null , docs)
    }).catch(error => {
        callback(error , null)
    })
}

exports.handle_request = handle_request;
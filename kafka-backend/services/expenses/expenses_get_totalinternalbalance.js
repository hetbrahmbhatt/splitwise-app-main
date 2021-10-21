
const groupBalanceSchema = require('../../models/groupBalance');
function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    groupBalanceSchema.find({
        groupID: req.body.groupID,
    }).then(response => {
        callback(null, response)
    })
}

exports.handle_request = handle_request;
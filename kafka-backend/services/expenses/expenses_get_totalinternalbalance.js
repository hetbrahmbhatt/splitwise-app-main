
const debtsSchema = require('../../models/groups');
const userSchema = require('../../models/users');
const groupBalanceSchema = require('../../models/groupBalance');

function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    groupBalanceSchema.find({
        groupID: req.body.groupID,
    }).then(response => {
        callback(null, response)
        // res.status(200).send(JSON.stringify(response))
    })
}

exports.handle_request = handle_request;
const userSchema = require('../../models/users');
function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    userSchema.find({ _id: req.body.userID }).then(docs => {
        callback(null, docs)
    }).catch(error => {
        callback(error, null)
    })

}

exports.handle_request = handle_request;
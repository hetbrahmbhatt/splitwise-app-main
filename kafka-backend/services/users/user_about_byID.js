const userSchema = require('../../models/users');

//find a user by Id
function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    userSchema.findOne({ _id: req.params.id }).then(docs => {
        callback(null, docs)
    }).catch(error => {
        callback(error, null)
    });

}

exports.handle_request = handle_request;
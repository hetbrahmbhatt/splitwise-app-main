const userSchema = require('../../models/users');

// find users with the same name
function handle_request(msg, callback) {
    let req = {
        query: msg
    }
    userSchema.find({ "name": { $regex: req.query.name_like } }).then(response => {
        callback(null, response)
    }
    ).catch(error => {
        callback(error, null)
    })

}

exports.handle_request = handle_request;
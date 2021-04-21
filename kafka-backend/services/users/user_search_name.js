const userSchema = require('../../models/users');


function handle_request(msg, callback) {
    let req = {
        query: msg
    }
    userSchema.find({ "name": { $regex: req.query.name_like } }).then(response => {
        callback(null, response)
    }
    ).catch(error => {
        console.log("Error in update", error)
        callback(error, null)
    })




}

exports.handle_request = handle_request;
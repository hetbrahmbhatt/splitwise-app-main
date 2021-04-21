const userSchema = require('../../models/users');
function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    userSchema.findOne({ _id: req.params.id }).then(docs => {
        console.log("USER by ID docs", docs);
        callback(null, docs)
    }).catch(error => {
        console.log(error);
        callback(error, null)
    });

}

exports.handle_request = handle_request;
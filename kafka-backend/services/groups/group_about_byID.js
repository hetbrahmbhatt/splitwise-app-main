
const groupSchema = require('../../models/groups');
function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    groupSchema.find({ _id: req.params.id }).then(docs => {
        console.log(docs);
        callback(null, docs)
    }).catch(error => {
        callback(error, null)
    })
}

exports.handle_request = handle_request;
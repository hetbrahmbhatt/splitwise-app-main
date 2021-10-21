
const DebtsSchema = require('../../models/debts');

// get total internal debt 
function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    DebtsSchema.find({ groupID: req.params.id }).then(docs => {
        callback(null, docs)
    });
}

exports.handle_request = handle_request;
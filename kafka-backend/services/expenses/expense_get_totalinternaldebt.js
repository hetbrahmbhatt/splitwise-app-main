
const DebtsSchema = require('../../models/debts');
var ObjectId = require('mongodb').ObjectID;
function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    DebtsSchema.find({ groupID: req.params.id }).then(docs => {
        callback(null, docs)
        // res.status(200).send(docs)
    });
}

exports.handle_request = handle_request;

const DebtsSchema = require('../../models/debts');
var ObjectId = require('mongodb').ObjectID;
function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    console.log("In total ");
    DebtsSchema.find({ groupID: req.params.id }).then(docs => {
        console.log(docs);
        callback(null, docs)
        // res.status(200).send(docs)
    });
}

exports.handle_request = handle_request;
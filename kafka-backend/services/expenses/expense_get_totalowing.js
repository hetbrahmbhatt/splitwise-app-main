
const DebtsSchema = require('../../models/debts');
var ObjectId = require('mongodb').ObjectID;

function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    DebtsSchema.find({
        $or: [
            {
                userID1: req.params.id,
                amount: { $lt: 0 }
            },
            {
                userID2: req.params.id,
                amount: { $gt: 0 }
            }
        ]

    }).then(docs => {
        console.log(docs)
        callback(null , docs)
        // res.status(200).send(JSON.stringify(docs))
    });
}

exports.handle_request = handle_request;
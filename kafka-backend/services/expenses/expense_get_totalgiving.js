
const DebtsSchema = require('../../models/debts');

// get total giving of a user
function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    DebtsSchema.find({
        $or: [
            {
                userID2: req.params.id,
                amount: { $lt: 0 }
            },
            {
                userID1: req.params.id,
                amount: { $gt: 0 }
            }
        ]
    }).then(docs => {
        callback(null, docs)
    });
}

exports.handle_request = handle_request;
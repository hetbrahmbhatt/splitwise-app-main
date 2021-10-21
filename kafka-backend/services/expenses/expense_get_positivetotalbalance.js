const groupBalanceSchema = require('../../models/groupBalance');
function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    groupBalanceSchema.aggregate(
        [
            // First Stage
            {
                $match: {
                    userID: req.params.id,

                    amount: { $gt: 0 }
                }
            },
            {
                $group:
                {
                    _id: "$currency",
                    amount: { $sum: "$amount" }
                }
            },
        ]
    ).then(response => {
        res.status(200).send(JSON.stringify(response));
    })
}

exports.handle_request = handle_request;
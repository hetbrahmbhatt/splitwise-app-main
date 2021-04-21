
const debtsSchema = require('../../models/groups');
const userSchema = require('../../models/users');
const groupBalanceSchema = require('../../models/groupBalance');

function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    console.log(req.body)
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
        console.log("here");
        console.log(response);
        res.status(200).send(JSON.stringify(response));
    })
}

exports.handle_request = handle_request;
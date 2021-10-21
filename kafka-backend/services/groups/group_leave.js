
const debtsSchema = require('../../models/debts');
const userSchema = require('../../models/users');

function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    debtsSchema.find({
        $or: [
            {
                userID1: req.body.userID,
                groupID: req.body.groupID,
                amount: { $ne: 0 }
            },
            {
                userID2: req.body.userID,
                groupID: req.body.groupID,
                amount: { $ne: 0 }
            }
        ]
    }).then(response => {
        if (response.length != 0) {
            callback(err, null)
        }
        else {
            userSchema.findByIdAndUpdate({ _id: req.body.userID }
                , { $pull: { acceptedGroups: { groupID: req.body.groupID } } }, { new: true }
            ).then(res => {
                if (res) {
                    callback(null, res)
                }
            })
        }
    })

}

exports.handle_request = handle_request;
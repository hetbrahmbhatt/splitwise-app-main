
const debtsSchema = require('../../models/groups');
function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    debtsSchema.findOneAndUpdate({ _id: req.body.groupID },
        {
            $set: {
                groupName: req.body.groupName,
            }
        }
    ).then(doc => {
        callback(null, doc)
    }).catch(error => {
        callback(err, null)
    })
}

exports.handle_request = handle_request;
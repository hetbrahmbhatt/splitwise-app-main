
const debtsSchema = require('../../models/groups');
const userSchema = require('../../models/users');
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
        console.log("Update successful")
        console.log(doc);
        callback(null, doc)
    }).catch(error => {
        console.log("Error in update", error)
        callback(err, null)
    })
}

exports.handle_request = handle_request;
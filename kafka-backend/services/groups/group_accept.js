
const groupSchema = require('../../models/groups');
const userSchema = require('../../models/users');

function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    var userID = req.body.userID;
    var groupID = req.body.groupID;
    if (req.body.type == 'accept') {
        userSchema.findOneAndUpdate({ _id: userID }
            , { $pull: { invitedGroups: { groupID: req.body.groupID } } }, { new: true }
        ).then(doc => {
            let newInvitation = {
                groupID: groupID,
                groupName: req.body.groupName,
                invitedBy: req.body.invitedBy,
            }
            userSchema.findOneAndUpdate({ _id: userID }
                , { $push: { acceptedGroups: newInvitation } }, { new: true }
            ).then(doc => {
                groupSchema.findOneAndUpdate({ _id: groupID },
                    {
                        $inc: {
                            count: 1,
                        }
                    }
                ).then(response => {
                    let membersSchema = {
                        groupID: req.body.groupID,
                        userID: req.body.userID,
                        userName: req.body.userName
                    }
                    groupSchema.findOneAndUpdate({ _id: req.body.groupID }
                        , { $push: { membersSchema: membersSchema } }, { new: true }
                    ).then(doc => {

                    })
                    callback(null, response)
                }).catch(error => {
                    callback(null, doc)
                })
            }).catch(error => {
                callback(null,error);
            })
        })
    }
    if (req.body.type == "ignore") {
        userSchema.findOneAndUpdate({ _id: userID }
            , { $pull: { invitedGroups: { groupID: req.body.groupID } } }, { new: true }
        ).then(doc => {
            callback(null, doc)
        }).catch(error => {
            console.log("error", error);
        })
    }
}

exports.handle_request = handle_request;

const groupSchema = require('../../models/groups');
const userSchema = require('../../models/users');

function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    let newGroup = new groupSchema({
        userID: req.body.userID,
        groupName: req.body.groupName,
        timestamp: Date.now(),
        count: 1,
        invitedBy: req.body.userName
    })
    newGroup.save().then(response => {
        let newGroupObjForInvitee = {
            groupID: response._id,
            groupName: req.body.groupName,
            invitedBy: "You"
        }
        userSchema.findByIdAndUpdate({ _id: req.body.userID }
            , { $push: { acceptedGroups: newGroupObjForInvitee } }, { new: true }
        ).then(doc => {
            let membersSchema = {
                groupID: response._id,
                userID: req.body.userID,
                userName: req.body.userName
            }
            groupSchema.findByIdAndUpdate({ _id: response._id }
                , { $push: { membersSchema: membersSchema } }, { new: true }
            ).then(doc => {
                for (let i = 0; i < req.body.selectedUsers.length; i++) {
                    let newInvitation = {
                        groupID: response._id,
                        groupName: req.body.groupName,
                        invitedBy: req.body.userName,
                    }
                    userSchema.findByIdAndUpdate({ _id: req.body.selectedUsers[i].value }
                        , { $push: { invitedGroups: newInvitation } }, { new: true }
                    ).then(doc => {
                    }).catch(error => {
                        console.log("error", error);
                    })
                }
                callback(null, doc)

            })

        }).catch(error => {
            callback(error, null)
        })
    }).catch(error => {
        callback(error, null)
    })
}

exports.handle_request = handle_request;
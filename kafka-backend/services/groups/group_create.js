
const groupSchema = require('../../models/groups');
const userSchema = require('../../models/users');
var ObjectId = require('mongodb').ObjectID;


function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    console.log(req.body);

    let newGroup = new groupSchema({
        userID: req.body.userID,
        groupName: req.body.groupName,
        timestamp: Date.now(),
        count: 1,
        invitedBy: req.body.userName
    })
    console.log("over here ")

    newGroup.save().then(response => {
        let newGroupObjForInvitee = {
            groupID: response._id,
            groupName: req.body.groupName,
            invitedBy: "You"
        }
        const _id = ObjectId(req.body.userID);
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
                        // res.status( 400 ).send( "Error following" );
                    })
                }
                // res.status(200).send(doc);
                callback(null, doc)

            })

        }).catch(error => {
            callback(error, null)

            // res.status( 400 ).send( "Error following" );
        })

        // res.status(200).send(obj)
    }).catch(error => {
        callback(error, null)
    })
}

exports.handle_request = handle_request;
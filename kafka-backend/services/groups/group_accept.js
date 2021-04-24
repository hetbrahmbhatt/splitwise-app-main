
const groupSchema = require('../../models/groups');
const userSchema = require('../../models/users');
var ObjectId = require('mongodb').ObjectID;

function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    var userID = req.body.userID;
    var groupID = req.body.groupID;
    console.log(req.body);
    console.log(userID);
    console.log(groupID);
    if (req.body.type == 'accept') {
        console.log("Inside Accept");
        userSchema.findOneAndUpdate({ _id: userID }
            , { $pull: { invitedGroups: { groupID: req.body.groupID } } }, { new: true }
        ).then(doc => {
            console.log("Invited Group Removed", doc)
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
                    console.log("Update successful")
                    console.log(response);
                    callback(null, response)
                }).catch(error => {
                    console.log("Error in update", error)
                    callback(null, doc)
                })
                // res.status( 200 ).send( doc );
            }).catch(error => {
                console.log("error", error);
                // res.status( 400 ).send( "Error following" );
            })
        })
    }
    if (req.body.type == "ignore") {
        console.log("In ignore");
        userSchema.findOneAndUpdate({ _id: userID }
            , { $pull: { invitedGroups: { groupID: req.body.groupID } } }, { new: true }
        ).then(doc => {
            callback(null, doc)
            console.log("Invited Group Removed", doc)
        }).catch(error => {
            console.log("error", error);
            callback(error, null)
        })
    }
}

exports.handle_request = handle_request;
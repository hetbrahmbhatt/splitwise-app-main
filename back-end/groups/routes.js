var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var mongoose = require('../config/db-config');
var groupSchema = require('../models/groups');
const userSchema = require('../models/users');
const groupSummarySchema = require('../models/groupSummary');
const recentActivitySchema = require('../models/recentactivity');
const debtsSchema = require('../models/debts');

var jwt = require('jsonwebtoken');
var { secret } = require('../config/config');
var kafka = require('../kafka/client');
var path = require('path');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;
var { secret } = require('../config/config')
var { auth, checkAuth } = require('../config/passport')
auth()
router.get('/groupbyid/:id', checkAuth, (req, res) => {
    kafka.make_request('group_about_byID', req.params, function (err, results) {
        console.log('in group By Id results');
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
});
// router.get('/groupbyid/:id', checkAuth, (req, res) => {
//     groupSchema.find({ _id: req.params.id }).then(docs => {
//         console.log(docs);
//         res.status(200).send(JSON.stringify(docs))
//     }).catch(error => {
//         res.status(400).send(error)
//     })
// });

router.post('/new', checkAuth, (req, res) => {
    console.log(req.body);
    kafka.make_request('group_create', req.body, function (err, results) {
        console.log('in group By create results');
        console.log(results)
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        }
        else if (results == null) {
            res.status(400).send("Invalid Credentials")

        }
        else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });


    // let newGroup = new groupSchema({
    //     userID: req.body.userID,
    //     groupName: req.body.groupName,
    //     timestamp: Date.now(),
    //     count: 1,
    //     image: req.body.updatedProfileImage,
    //     invitedBy: req.body.userName
    // })
    // newGroup.save().then(response => {
    //     console.log("Group Created successfully")
    //     console.log(response)
    //     let newGroupObjForInvitee = {
    //         groupID: response._id,
    //         groupName: req.body.groupName,
    //         invitedBy: "You"
    //     }
    //     userSchema.findByIdAndUpdate({ _id: req.body.userID }
    //         , { $push: { acceptedGroups: newGroupObjForInvitee } }, { new: true }
    //     ).then(doc => {
    //         let membersSchema = {
    //             groupID: response._id,
    //             userID: req.body.userID,
    //             userName: req.body.userName
    //         }
    //         groupSchema.findByIdAndUpdate({ _id: response._id }
    //             , { $push: { membersSchema: membersSchema } }, { new: true }
    //         ).then(doc => {
    //             for (let i = 0; i < req.body.selectedUsers.length; i++) {
    //                 let newInvitation = {
    //                     groupID: response._id,
    //                     groupName: req.body.groupName,
    //                     invitedBy: req.body.userName,
    //                 }
    //                 userSchema.findByIdAndUpdate({ _id: req.body.selectedUsers[i].value }
    //                     , { $push: { invitedGroups: newInvitation } }, { new: true }
    //                 ).then(doc => {
    //                     console.log("Group Invitation Added", doc)
    //                 }).catch(error => {
    //                     console.log("error", error);
    //                     // res.status( 400 ).send( "Error following" );
    //                 })
    //             }
    //             console.log("Group Invitation Added", doc)
    //             res.status(200).send(doc);
    //         })

    //     }).catch(error => {
    //         console.log("error", error);
    //         // res.status( 400 ).send( "Error following" );
    //     })

    //     // res.status(200).send(obj)
    // }).catch(error => {
    //     console.log("Error", error)
    //     res.status(400).send(error)
    // })

});


// router.post('/new', checkAuth, (req, res) => {
//     console.log(req.body);
//     console.log(req.body.selectedUsers.length);

//     let newGroup = new groupSchema({
//         userID: req.body.userID,
//         groupName: req.body.groupName,
//         timestamp: Date.now(),
//         count: 1,
//         image: req.body.updatedProfileImage,
//         invitedBy: req.body.userName
//     })
//     newGroup.save().then(response => {
//         console.log("Group Created successfully")
//         console.log(response)
//         let newGroupObjForInvitee = {
//             groupID: response._id,
//             groupName: req.body.groupName,
//             invitedBy: "You"
//         }
//         userSchema.findByIdAndUpdate({ _id: req.body.userID }
//             , { $push: { acceptedGroups: newGroupObjForInvitee } }, { new: true }
//         ).then(doc => {
//             let membersSchema = {
//                 groupID: response._id,
//                 userID: req.body.userID,
//                 userName: req.body.userName
//             }
//             groupSchema.findByIdAndUpdate({ _id: response._id }
//                 , { $push: { membersSchema: membersSchema } }, { new: true }
//             ).then(doc => {
//                 for (let i = 0; i < req.body.selectedUsers.length; i++) {
//                     let newInvitation = {
//                         groupID: response._id,
//                         groupName: req.body.groupName,
//                         invitedBy: req.body.userName,
//                     }
//                     userSchema.findByIdAndUpdate({ _id: req.body.selectedUsers[i].value }
//                         , { $push: { invitedGroups: newInvitation } }, { new: true }
//                     ).then(doc => {
//                         console.log("Group Invitation Added", doc)
//                     }).catch(error => {
//                         console.log("error", error);
//                         // res.status( 400 ).send( "Error following" );
//                     })
//                 }
//                 console.log("Group Invitation Added", doc)
//                 res.status(200).send(doc);
//             })

//         }).catch(error => {
//             console.log("error", error);
//             // res.status( 400 ).send( "Error following" );
//         })

//         // res.status(200).send(obj)
//     }).catch(error => {
//         console.log("Error", error)
//         res.status(400).send(error)
//     })

// });

router.put('/invite', checkAuth, (req, res) => {
    kafka.make_request('group_accept', req.body, function (err, results) {
        console.log('in group By create results');
        console.log(results)
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
})
// router.put('/invite', checkAuth, (req, res) => {
//     var userID = req.body.userID;
//     var groupID = req.body.groupID;
//     console.log(req.body);
//     console.log(userID);
//     console.log(groupID);
//     if (req.body.type == 'accept') {
//         console.log("Inside Accept");
//         userSchema.findOneAndUpdate({ _id: userID }
//             , { $pull: { invitedGroups: { groupID: req.body.groupID } } }, { new: true }
//         ).then(doc => {
//             console.log("Invited Group Removed", doc)
//             let newInvitation = {
//                 groupID: groupID,
//                 groupName: req.body.groupName,
//                 invitedBy: req.body.invitedBy,
//             }
//             userSchema.findOneAndUpdate({ _id: userID }
//                 , { $push: { acceptedGroups: newInvitation } }, { new: true }
//             ).then(doc => {
//                 console.log("Group Added Successfully", doc)
//                 groupSchema.findOneAndUpdate({ _id: groupID },
//                     {
//                         $inc: {
//                             count: 1,
//                         }
//                     }
//                 ).then(response => {
//                     let membersSchema = {
//                         groupID: req.body.groupID,
//                         userID: req.body.userID,
//                         userName: req.body.userName
//                     }
//                     groupSchema.findOneAndUpdate({ _id: req.body.groupID }
//                         , { $push: { membersSchema: membersSchema } }, { new: true }
//                     ).then(doc => {

//                     })
//                     console.log("Update successful")
//                     console.log(response);
//                     res.status(200).send(response)
//                 }).catch(error => {
//                     console.log("Error in update", error)
//                     res.status(400).send(error)
//                 })
//                 // res.status( 200 ).send( doc );
//             }).catch(error => {
//                 console.log("error", error);
//                 // res.status( 400 ).send( "Error following" );
//             })
//         })
//     }
//     if (req.body.type == "ignore") {
//         console.log("In ignore");
//         userSchema.findOneAndUpdate({ _id: userID }
//             , { $pull: { invitedGroups: { groupID: req.body.groupID } } }, { new: true }
//         ).then(doc => {
//             res.status(200).send(doc)
//             console.log("Invited Group Removed", doc)
//         }).catch(error => {
//             console.log("error", error);
//             res.status(400).send("Error");
//         })
//     }
// });
router.post('/leavegroup', (req, res) => {
    kafka.make_request('group_leave', req.body, function (err, results) {
        console.log('in group By create results');
        console.log(results)
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
    // console.log(req.body)

    // debtsSchema.find({
    //     $or: [
    //         {
    //             userID1: req.body.userID,
    //             groupID: req.body.groupID,
    //             amount: { $ne: 0 }
    //         },
    //         {
    //             userID2: req.body.userID,
    //             groupID: req.body.groupID,
    //             amount: { $ne: 0 }
    //         }
    //     ]
    // }).then(response => {
    //     console.log(response);

    //     if (response.length != 0) {
    //         response123.send(400)
    //     }
    //     else {
    //         userSchema.findByIdAndUpdate({ _id: req.body.userID }
    //             , { $pull: { acceptedGroups: { groupID: req.body.groupID } } }, { new: true }
    //         ).then(res => {
    //             if (res) {
    //                 console.log("over here")
    //                 response123.status(200).end();
    //             }

    //         })
    //     }
    // })

})





// get all users
router.put('/updategroup/', checkAuth, (req, res) => {
    kafka.make_request('group_update', req.body, function (err, results) {
        console.log('in group By create results');
        console.log(results)
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
    // console.log(req.body);
    // groupSchema.findOneAndUpdate({ _id: req.body.groupID },
    //     {
    //         $set: {
    //             groupName: req.body.groupName,
    //         }
    //     }
    // ).then(doc => {
    //     console.log("Update successful")
    //     console.log(doc);
    //     res.status(200).send(doc)
    // }).catch(error => {
    //     console.log("Error in update", error)
    //     res.status(400).send(error)
    // })
});
router.get('/groupsummarybyid/:id', checkAuth, (req, res) => {
    kafka.make_request('group_get_summary', req.params, function (err, results) {
        console.log('in group By create results');
        console.log(results)
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
    // console.log(req.params.id)
    // groupSummarySchema.find({ groupID: req.params.id }).sort({ createdAt: '-1' }).then(docs => {
    //     console.log("Group Summary by User", docs)
    //     res.status(200).send(docs)
    // }).catch(error => {
    //     console.log("Error in Fetching Group Summary", error)
    // })
});
router.put('/removemessage/', checkAuth, (req, res) => {
    kafka.make_request('group_remove_message', req.body, function (err, results) {
        console.log('in group By create results');
        console.log(results)
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
    // console.log(req.body)
    // groupSummarySchema.findOneAndUpdate({ _id: req.body.groupSummaryID }
    //     , { $pull: { messages: { _id: req.body.messageID } } }, { new: true }
    // ).then(doc => {
    //     res.status(200).send(doc);
    //     console.log("Notes/Comments Delete", doc)
    // }).catch(error => {
    //     console.log("error", error);
    // })
});
// router.put('/message', checkAuth, (req, res) => {
//     console.log(req.body)
//     const _id = ObjectId(req.body.groupSummaryID);
//     var messageData = {
//         name: req.body.userName,
//         message: req.body.messageString
//     }
//     let newRecentActivity = new recentActivitySchema({
//         userID: req.body.userID,
//         payeeID: "",
//         userName: req.body.userName,
//         currency: "",
//         groupID: "",
//         groupName: req.body.groupName,
//         description: "",
//         amount: "",
//         timestamp: "",
//         settleflag: "",
//         commentFlag: 1,
//         message: req.body.messageString
//     })
//     const groupID = ObjectId(req.body.groupID);

//     groupSchema.find({ _id: groupID }).then(doc => {
//         console.log("Group DOCS", doc)
//         console.log(doc[0].membersSchema)
//         for (let i = 0; i < doc[0].membersSchema.length; i++) {
//             if (doc[0].membersSchema[i].userID != req.body.userID) {
//                 let newActivity = new recentActivitySchema({
//                     userID: doc[0].membersSchema[i].userID,
//                     payeeID: "",
//                     userName: req.body.userName,
//                     currency: "",
//                     groupID: "",
//                     groupName: req.body.groupName,
//                     description: "",
//                     amount: "",
//                     timestamp: "",
//                     settleflag: "",
//                     commentFlag: 1,
//                     message: req.body.messageString
//                 })
//                 newActivity.save().then(response => {
//                     console.log("Recent Activity Added successfully.")
//                 })
//             }
//         }
//     }).catch(error => {
//         console.log("Error in Fetching Group Summary", error)
//     })

//     newRecentActivity.save().then(response => {
//         console.log("Recent Activity Added successfully.")
//     })
//     groupSummarySchema.findOneAndUpdate({ _id: _id }
//         , { $push: { messages: messageData } }, { new: true }
//     ).then(doc => {
//         res.status(200).send(doc);
//         console.log("Notes/Comments Added", doc)
//     }).catch(error => {
//         console.log("error", error);
//     })
// });





router.put('/message', checkAuth, (req, res) => {
    kafka.make_request('group_add_message', req.body, function (err, results) {
        console.log('in group By create results');
        console.log(results)
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
    //     console.log(req.body)
    //     const _id = ObjectId(req.body.groupSummaryID);
    //     var messageData = {
    //         name: req.body.userName,
    //         message: req.body.messageString
    //     }
    //     let newRecentActivity = new recentActivitySchema({
    //         userID: req.body.userID,
    //         payeeID: "",
    //         userName: req.body.userName,
    //         currency: "",
    //         groupID: "",
    //         groupName: req.body.groupName,
    //         description: "",
    //         amount: "",
    //         timestamp: "",
    //         settleflag: "",
    //         commentFlag: 1,
    //         message: req.body.messageString
    //     })
    //     const groupID = ObjectId(req.body.groupID);

    //     groupSchema.find({ _id: groupID }).then(doc => {
    //         console.log("Group DOCS", doc)
    //         console.log(doc[0].membersSchema)
    //         for (let i = 0; i < doc[0].membersSchema.length; i++) {
    //             if (doc[0].membersSchema[i].userID != req.body.userID) {
    //                 let newActivity = new recentActivitySchema({
    //                     userID: doc[0].membersSchema[i].userID,
    //                     payeeID: "",
    //                     userName: req.body.userName,
    //                     currency: "",
    //                     groupID: "",
    //                     groupName: req.body.groupName,
    //                     description: "",
    //                     amount: "",
    //                     timestamp: "",
    //                     settleflag: "",
    //                     commentFlag: 1,
    //                     message: req.body.messageString
    //                 })
    //                 newActivity.save().then(response => {
    //                     console.log("Recent Activity Added successfully.")
    //                 })
    //             }
    //         }
    //     }).catch(error => {
    //         console.log("Error in Fetching Group Summary", error)
    //     })

    //     newRecentActivity.save().then(response => {
    //         console.log("Recent Activity Added successfully.")
    //     })
    //     groupSummarySchema.findOneAndUpdate({ _id: _id }
    //         , { $push: { messages: messageData } }, { new: true }
    //     ).then(doc => {
    //         res.status(200).send(doc);
    //         console.log("Notes/Comments Added", doc)
    //     }).catch(error => {
    //         console.log("error", error);
    //     })
});

router.post('/uploadprofileimage', (req, res) => {
    console.log(req.files);
    if (req.files === null) {
        res.status(400).send('No File Upload');
    }
    const file = req.files.profileImage;
    //Get the userID,file name from frontend
    var groupID = req.files.profileImage.name.split(',')[1];
    console.log(groupID);
    const fileName = req.files.profileImage.name.split(',')[0];
    console.log(fileName);
    var pathToImage = path.join(__dirname, '../public');
    const filePathwithoutfileName = pathToImage + '/images/grouppics/' + groupID;
    const filePath = pathToImage + '/images/grouppics/' + groupID + '/' + fileName;
    //Create a file with that path
    if (!fs.existsSync(filePathwithoutfileName)) {
        fs.mkdirSync(filePathwithoutfileName);
    }
    //Move the image to that path
    file.mv(filePath, err => {
        if (err) {
            console.log(err);
            res.status(500).end(err);
        }
        else {
            console.log("over here")
            groupSchema.findOneAndUpdate({ _id: ObjectId(groupID) },
                {
                    $set: {
                        image: fileName
                    }
                }
            ).then(response => {
                console.log("Update successfull")
                console.log(response);
                //Send the file name and file path to the client
                res.json({
                    fileName: fileName,
                    filePath: filePath
                })
            }).catch(error => {
                console.log("Error in update", error)
                res.status(400).send(error)
            })
        }
    })
})



module.exports = router;
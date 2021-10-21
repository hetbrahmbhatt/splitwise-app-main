// import the required dependencies
var express = require('express');
var router = express.Router();
var groupSchema = require('../models/groups');
var kafka = require('../kafka/client');
var path = require('path');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;
var { auth, checkAuth } = require('../config/passport')
auth()

const {
    CREATE_NEW_GROUP,
    ACCEPT_GROUP_INVITATION,
    LEAVE_GROUP,
    UPDATE_GROUP_DETAILS,
    GET_GROUP_DETAILS,
    DELETE_MESSAGE,
    CREATE_MESSAGE,
    UPDATE_PROFILE_IMAGE,
  } = require("../kafka/topics");
// get group information
router.get("/groupbyid/:id", checkAuth, (req, res) => {
    kafka.make_request(GET_GROUP_DETAILS, req.params, function (err, results) {
        if (err) {
            res.status(400).send("Invalid Credentials")
        } else {
            res.status(200).send(results)
        }
    });
});

// create a new group
router.post("/new", checkAuth, (req, res) => {
    kafka.make_request(CREATE_NEW_GROUP, req.body, function (err, results) {
        if (err) {
            res.status(400).send("Error in creating a group")
        }
        else {
            res.status(200).send(results)
        }
    });
});

// accept group invitation 
router.put("/invite", checkAuth, (req, res) => {
    kafka.make_request(ACCEPT_GROUP_INVITATION, req.body, function (err, results) {
        if (err) {
            res.status(400).send("Error in inviting")
        } else {
            res.status(200).send(results)
        }
    });
})

// leave a particular group
router.post("/leavegroup", (req, res) => {
    kafka.make_request(LEAVE_GROUP, req.body, function (err, results) {
        if (err) {
            res.status(400).send("Error in leaving a particular group")
        } else {
            res.status(200).send(results)
        }
    });
})

// update group details
router.put("/updategroup", checkAuth, (req, res) => {
    kafka.make_request(UPDATE_GROUP_DETAILS, req.body, function (err, results) {
        if (err) {
            res.status(400).send("Error in updating a group")
        } else {
            res.status(200).send(results)
        }
    });
});

// get group summary 
router.get("/groupsummarybyid/:id", checkAuth, (req, res) => {
    kafka.make_request(GET_GROUP_SUMMARY, req.params, function (err, results) {
        if (err) {
            res.status(400).send("Error in getting group summary details")
        } else {
            res.status(200).send(results)
        }
    });
});

// remove message (content)
router.put("/removemessage/", checkAuth, (req, res) => {
    kafka.make_request(DELETE_MESSAGE, req.body, function (err, results) {
        if (err) {
            res.status(400).send("Error in removing a message")
        } else {
            res.status(200).send(results)
        }
    });
});

// create a message
router.put("/message", checkAuth, (req, res) => {
    kafka.make_request(CREATE_MESSAGE, req.body, function (err, results) {
        if (err) {
            res.status(400).send("Error in adding a message")
        } else {
            res.status(200).send(results)
        }
    });
});

// upload a profile picture 
router.post("/uploadprofileimage", (req, res) => {
    if (req.files === null) {
        res.status(400).send('No File Upload');
    }
    const file = req.files.profileImage;
    //Get the userID,file name from frontend
    var groupID = req.files.profileImage.name.split(',')[1];
    const fileName = req.files.profileImage.name.split(',')[0];
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
            res.status(500).end(err);
        }
        else {
            groupSchema.findOneAndUpdate({ _id: ObjectId(groupID) },{
                    $set: {
                        image: fileName
                    }
                }
            ).then(response => {
                //Send the file name and file path to the client
                res.json({
                    fileName: fileName,
                    filePath: filePath
                })
            }).catch(error => {
                res.status(400).send(error)
            })
        }
    })
})
module.exports = router;
// import the required dependencies
var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var userSchema = require('../models/users');
var jwt = require('jsonwebtoken');
var { secret } = require('../config/config');
var kafka = require('../kafka/client');
var path = require('path');
var fs = require('fs');s
var ObjectId = require('mongodb').ObjectID;
var { secret } = require('../config/config')
const AWS = require('aws-sdk');


const {
    USER_LOGIN,
    USER_SIGNUP,
    GET_USER_PROFILE,
    GET_RECENT_ACTIVITY,
    UPLOAD_PROFILE_IMAGE,
    EDIT_PROFILE,
    SEARCH_USER_BY_EMAIL,
    SEARCH_USER_BY_NAME
  } = require("../kafka/topics");
// Enter copied or downloaded access ID and secret key here
const ID = 'AKIAV7ZXMAHEWXCCV226';
const SECRET = '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';
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});
// passport.js  check auth
var { auth, checkAuth } = require('../config/passport')
auth();
// signup
router.post('/signup', (req, res) => {
    kafka.make_request(USER_SIGNUP, req.body, function (err, results) {
        if (err) {
            res.status(400).send(err)
        }
        else if (results == null && err == null) {
            res.status(400).send(err)
        }
        else {
            res.status(200).send(results)
        }
    });
})

// login
router.post("/login", (req, res) => {
    userSchema.findOne({ email: req.body.email }).then(doc => {
        if (bcrypt.compareSync(req.body.password, doc.password)) {
            let payload = {
                _id: doc._id,
                email: doc.email,
                name: doc.name,
                defaultcurrency: doc.defaultCurrency,
                timezone: doc.timezone
            }
            let token = jwt.sign(payload, secret, {
                expiresIn: 1008000
            })
            res.status(200).send("Bearer " + token)
        } else {
            res.status(401).send("Invalid Credentials")
            // callback( "Invalid credentials", null )
        }

    }).catch(error => {
    })
});

// fetch the details of an user 
router.get("/userbyid/:id", (req, res) => {
    kafka.make_request('GET_USER_PROFILE', req.params, function (err, results) {
        if (err) {
            res.status(400).send("Invalid Credentials")
        } else {
            res.status(200).send(results)
        }
    });
});

// get recent activity for a user
router.post("/recentactivity", checkAuth, (req, res) => {
    kafka.make_request(GET_RECENT_ACTIVITY, req.params, function (err, results) {
        if (err) {
            res.status(400).send("Invalid Credentials")
        } else {
            res.status(200).send(results)
        }
    });
})

// edit the details of the user 
router.put("/editprofile", checkAuth, (req, res) => {
    kafka.make_request(EDIT_PROFILE, req.body, function (err, results) {
        if (results.email == req.body.originEmail) {
            res.status(400).send("Invalid Credentials");
        }
        else {
            res.status(200).send(results)
        }
    });
})

// search the users by email
router.get("/searchbyemail", checkAuth, (req, res) => {
    kafka.make_request(SEARCH_USER_BY_EMAIL, req.query, function (err, results) {
        if (err) {
            res.status(400).send("Invalid Credentials")
        } else {
            res.status(200).send(results)
        }
    });
});

// search the users by name
router.get("/searchbyname", checkAuth, (req, res) => {
    kafka.make_request('SEARCH_USER_BY_NAME', req.query, function (err, results) {
        if (err) {
            res.status(400).send("Invalid Credentials")
        } else {
            res.status(200).send(results)
        }
    });
});

// upload the profile image seprarately
router.post("/uploadprofileimage", (req, res) => {
    if (req.files === null) {
        res.status(400).send('No File Upload');
    }
    const file = req.files.profileImage;
    var userID = req.files.profileImage.name.split(',')[1];// get the user details from front-end
    const fileName = req.files.profileImage.name.split(',')[0];// file name
    var pathToImage = path.join(__dirname, '../public');
    const filePathwithoutfileName = pathToImage + '/images/profilepics/' + userID;
    const filePath = pathToImage + '/images/profilepics/' + userID + '/' + fileName;
    // create a file with that path
    if (!fs.existsSync(filePathwithoutfileName)) {
        fs.mkdirSync(filePathwithoutfileName);
    }
    // move the image to that path
    file.mv(filePath, err => {
        if (err) {
            res.status(500).end(err);
        }
        else {
            userSchema.findOneAndUpdate({ _id: ObjectId(userID) },
                {
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
});
module.exports = router;
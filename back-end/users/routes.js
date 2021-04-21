var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var mongoose = require('../config/db-config');
var userSchema = require('../models/users');
var jwt = require('jsonwebtoken');
var { secret } = require('../config/config');
var kafka = require('../kafka/client');
var path = require('path');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;
var { secret } = require('../config/config')
const AWS = require('aws-sdk');
// Enter copied or downloaded access ID and secret key here
const ID = 'AKIAV7ZXMAHEWXCCV226';
const SECRET = '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';
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});
var { auth, checkAuth } = require('../config/passport')
auth();
//signup
router.post('/signup', (req, res) => {
    console.log(req.body);
    kafka.make_request('user_signup', req.body, function (err, results) {
        if (err) {
            console.log("Inside err", err);
            res.status(400).send(err)
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
})
// router.post('/signup', (req, res) => {
//     bcrypt.hash(req.body.password, 10, (err, hash) => {
//         let user = new userSchema({
//             name: req.body.name,
//             email: req.body.email,
//             password: hash,
//             language: "",
//             phoneno: "",
//             image: "",
//         })
//         user.save().then(response => {
//             console.log("Signup successful")
//             console.log(response);
//             let payload = {
//                 _id: response._id,
//                 email: response.email,
//                 name: response.name,
//                 defaultcurrency: response.defaultCurrency,
//                 timezone: response.timezone
//             }
//             let token = jwt.sign(payload, secret, {
//                 expiresIn: 1008000
//             })
//             // res.status(200).send(obj)
//             res.status(200).send("Bearer " + token)
//         }).catch(error => {
//             console.log("Error", error)
//             res.status(400).send(error)
//         })
//     })
// });

//login
router.post('/login', (req, res) => {
    kafka.make_request('user_login', req.body, function (err, results) {
        console.log('in user_login results');

        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
});
//login
// router.post('/login', (req, res) => {
//     userSchema.findOne({ email: req.body.email }).then(doc => {
//         if (bcrypt.compareSync(req.body.password, doc.password)) {
//             console.log("Login Successful");
//             let payload = {
//                 _id: doc._id,
//                 email: doc.email,
//                 name: doc.name,
//                 defaultcurrency: doc.defaultCurrency,
//                 timezone: doc.timezone
//             }
//             let token = jwt.sign(payload, secret, {
//                 expiresIn: 1008000
//             })
//             console.log("Login Successfull")
//             res.status(200).send("Bearer " + token)
//         } else {
//             console.log("Invalid Credentials")
//             res.status(401).send("Invalid Credentials")
//         }
//     }).catch(error => {
//         console.log("User Not Found", error)
//         res.status(400).send("User Not found")
//     })

// })
//get by users
// router.get('/userbyid/:id', checkAuth, (req, res) => {
//     console.log(req.params.id);
//     userSchema.find({ _id: req.params.id }).then(docs => {
//         console.log("USER by ID docs", docs);
//         res.status(200).send(JSON.stringify(docs));
//     }).catch(error => {
//         res.status(400).send(error)
//     })
// })


router.get('/userbyid/:id', (req, res) => {
    kafka.make_request('user_about_byID', req.params, function (err, results) {
        console.log('in user_login results');

        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
});
//get recent Activity for a user
router.post('/recentactivity', checkAuth, (req, res) => {
    kafka.make_request('user_get_recentActivity', req.params, function (err, results) {
        console.log('in user_login results');

        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
})


// router.post('/recentactivity', checkAuth, (req, res) => {
//     console.log("Body", req.body);
//     console.log(req.body.userID);
//     userSchema.find({ _id: req.body.userID }).then(docs => {
//         console.log(docs);
//         res.status(200).send(JSON.stringify(docs))
//     }).catch(error => {
//         res.status(400).send(error)
//     })
// })
// get all users

router.put('/editprofile', checkAuth, (req, res) => {
    kafka.make_request('user_about_update', req.body, function (err, results) {
        console.log('in User update');
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
})


// router.put('/editprofile', checkAuth, (req, res) => {
//     console.log(req.body);
//     userSchema.findOneAndUpdate({ email: req.body.email },
//         {
//             $set: {
//                 name: req.body.name,
//                 email: req.body.email,
//                 defaultCurrency: req.body.defaultcurrency,
//                 timezone: req.body.timezone,
//                 language: req.body.language,
//                 phoneno: req.body.phoneno
//             }
//         }
//     ).then(response => {
//         console.log("Update successfull")
//         console.log(response);
//         res.status(200).send(response)
//     }).catch(error => {
//         console.log("Error in update", error)
//         res.status(400).send(error)
//     })
// });
router.get('/searchbyemail', checkAuth, (req, res) => {
    kafka.make_request('user_search_email', req.query, function (err, results) {
        console.log('in User Email');
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
});
//get users based on email
// router.get('/searchbyemail', checkAuth, (req, res) => {
//     userSchema.find({ "email": { $regex: req.query.email_like } }).then(response => {
//         res.status(200).send(JSON.stringify(response));
//     })
// });

router.get('/searchbyname', checkAuth, (req, res) => {
    kafka.make_request('user_search_name', req.query, function (err, results) {
        console.log('in User Name');
        if (err) {
            console.log("Inside err");
            res.status(400).send("Invalid Credentials")
        } else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    });
});
//get users based on name
// router.get('/searchbyname', checkAuth, (req, res) => {
//     userSchema.find({ "name": { $regex: req.query.name_like } }).then(response => {
//         res.status(200).send(JSON.stringify(response));
//     })
// });
router.post('/uploadprofileimage', (req, res) => {

    const file = req.files.profileImage;
    //Get the userID,file name from frontend
    var fileName = req.files.profileImage.name.split(',')[0];
    var userID = req.files.profileImage.name.split(',')[1];
    var pathToImage = path.join(__dirname, '../public');
    const filePathwithoutfileName = pathToImage + '/images/profilepics/' + userID;
    const filePath = pathToImage + '/images/profilepics/' + userID + '/' + fileName;
    //Create a file with that path
    if (!fs.existsSync(filePathwithoutfileName)) {
        fs.mkdirSync(filePathwithoutfileName);
    }
    //Move the image to that path
    file.mv(filePath, err => {
        if (err) {
            console.log(err);
            return res.status(500).end(err);
        }
        else {
            console.log(req.files);
            if (req.files === null) {
                return res.status(400).send('No File Upload');
            }
            console.log(filePath)
            const fileContent = fs.readFileSync(filePath);
            console.log(Date.now());
            // Setting up S3 upload parameters
            fileName = fileName + '_' + userID;
            const params = {
                Bucket: 'splitwise-app-main',
                Key: fileName, // File name you want to save as in S3
                Body: fileContent
            };

            // Uploading files to the bucket
            s3.upload(params, function (err, data) {
                if (err) {
                    throw err;
                }
                console.log(`File uploaded successfully. ${data.Location}`);
            });
            userSchema.findOneAndUpdate({ _id: ObjectId(userID) },
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
});
module.exports = router;
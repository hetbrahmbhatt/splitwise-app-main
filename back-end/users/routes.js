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
var { auth, checkAuth } = require('../config/passport')
auth();
//signup
router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        let user = new userSchema({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            language: "",
            timezone: "",
            phoneno: "",
            image: "",
        })
        user.save().then(response => {
            console.log("Signup successfull")
            console.log(response);
            let payload = {
                _id: doc._id,
                email: doc.email,
                name: doc.name,
                defaultcurrency: doc.defaultcurrency,
                timezone: doc.timezone
            }
            let token = jwt.sign(payload, secret, {
                expiresIn: 1008000
            })
            // res.status(200).send(obj)
            res.status(200).send("Bearer " + token)
        }).catch(error => {
            console.log("Error", error)
            res.status(400).send(error)
        })
    })
});


//login
router.post('/login',(req, res) => {
    userSchema.findOne({ email: req.body.email }).then(doc => {
        if (bcrypt.compareSync(req.body.password, doc.password)) {
            console.log("Login Successfull");
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
            console.log("Login Successfull")
            res.status(200).send("Bearer " + token)
        } else {
            console.log("Invalid Credentials")
            res.status(401).send("Invalid Credentials")
        }
    }).catch(error => {
        console.log("User Not Found", error)
        res.status(400).send("User Not found")
    })

})
//get orders by users
router.get('/userbyid/:id', checkAuth, (req, res) => {
    console.log(req.params.id);
    userSchema.find({ _id: req.params.id }).then(docs => {
        console.log(docs);
        res.status(200).send(JSON.stringify(docs))
    }).catch(error => {
        res.status(400).send(error)
    })
})
// get all users
router.put('/editprofile', checkAuth, (req, res) => {
    userSchema.findOneAndUpdate({ email: req.body.email },
        {
            $set: {
                name: req.body.name,
                email: req.body.email,
                defaultCurrency: req.body.defaultcurrency,
                timezone: req.body.timezone,
                language: req.body.language,
                phoneno: req.body.phoneno
            }
        }
    ).then(response => {
        console.log("Update successfull")
        console.log(response);
        res.status(200).send(response)
    }).catch(error => {
        console.log("Error in update", error)
        res.status(400).send(error)
    })
});

//get users based on email
router.get('/searchbyemail', checkAuth, (req, res) => {
    userSchema.find({ "email": { $regex: req.query.email_like } }).then(response => {
        res.status(200).send(JSON.stringify(response));
    })
});
//get users based on name
router.get('/searchbyname', checkAuth, (req, res) => {
    userSchema.find({ "name": { $regex: req.query.name_like } }).then(response => {
        res.status(200).send(JSON.stringify(response));
    })
});
router.post('/uploadprofileimage', (req, res) => {
    console.log(req.files);
    if (req.files === null) {
        return res.status(400).send('No File Upload');
    }
    const file = req.files.profileImage;
    //Get the userID,file name from frontend
    var userID = req.files.profileImage.name.split(',')[1];
    const fileName = req.files.profileImage.name.split(',')[0];
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
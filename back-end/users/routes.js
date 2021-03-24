var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var mongoose = require('../config/db-config');
var userSchema = require('../models/users');
var jwt = require('jsonwebtoken');
var { secret } = require('../config/config');
var kafka = require('../kafka/client');
// var { auth } = require('../config/passport')
// auth();

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
            var obj = {
                id: response._id,
                name: req.body.name,
                email: req.body.email,
                defaultcurrency: response.defaultCurrency,
            }
            res.status(200).send(obj)
        }).catch(error => {
            console.log("Error", error)
            res.status(400).send(error)
        })
    })
});


//login
router.post('/login', (req, res) => {

    userSchema.findOne({ email: req.body.email }).then(doc => {

        if (bcrypt.compareSync(req.body.password, doc.password)) {
            console.log("Login Successfull");
            console.log(doc);
            res.status(200).send(doc)
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
router.get('/userbyid/:id', (req, res) => {
    console.log(req.params.id);
    userSchema.find({ _id: req.params.id }).then(docs => {
        console.log(docs);
        res.status(200).send(JSON.stringify(docs))
    }).catch(error => {
        res.status(400).send(error)
    })


})
// get all users
router.put('/editprofile', (req, res) => {
    console.log("Herererererrer")
    console.log(req.body);
    userSchema.findOneAndUpdate({ email: req.body.email },
        {
            $set: {
                name: req.body.name,
                email: req.body.email,
                defaultcurrency: req.body.defaultcurrency,
                timezone: req.body.timezone,
                language: req.body.language,
                phoneno:req.body.phoneno
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

//get user about by email
router.get('/about/:email', (req, res) => {
    kafka.make_request('user_aboutbyEmail', req.params, function (err, results) {
        if (err) {
            console.log("Inside err");
            res.status(400).send("Error Fetching users", err)
        } else {
            console.log("Inside else", results);
            res.status(200).send(JSON.stringify(results))

        }

    });
});


//get user about by id
router.get('/aboutbyID/:id', (req, res) => {
    kafka.make_request('user_aboutbyID', req.params, function (err, results) {
        if (err) {
            console.log("Inside err");
            res.status(400).send("Error Fetching users", err)
        } else {
            console.log("Inside else", results);
            res.status(200).send(JSON.stringify(results))

        }

    });
});



//update user about
router.put('/about', (req, res) => {
    kafka.make_request('user_about', req.body, function (err, results) {
        if (err) {
            console.log("Inside err");
            res.status(400).send("Error Fetching users", err)
        } else {
            console.log("Inside else", results);
            res.status(200).send(JSON.stringify(results))

        }

    });

});


//upload profile pic
router.post('/uploadpicture', (req, res) => {
    let upload = req.app.get('upload_profileImage');
    upload(req, res, err => {
        if (err) {
            console.log("Error uploading image", err);
            res.status(400).end('Issue with uploading')
        } else {
            console.log("Inside upload", req.file, req.body);
            req.body.file = req.file
            kafka.make_request('upload_picture', req.body, function (err, results) {
                if (err) {
                    console.log("Inside err");
                    res.status(400).send("Error Fetching users", err)
                } else {
                    console.log("Inside else", results);
                    res.status(200).send(JSON.stringify(results))

                }

            });


        }
    });
});

//follow user
router.post('/follow', (req, res) => {

    console.log("follow", req.body)
    kafka.make_request('user_follow', req.body, function (err, results) {
        if (err) {
            console.log("Inside err");
            res.status(400).send("Error Fetching users", err)
        } else {
            console.log("Inside else", results);
            res.status(200).send(JSON.stringify(results))

        }

    });
})


//reply to message
router.put('/message', (req, res) => {
    kafka.make_request('user_message', req.body, function (err, results) {
        if (err) {
            console.log("Inside err");
            res.status(400).send("Error Fetching users", err)
        } else {
            console.log("Inside else", results);
            res.status(200).send(JSON.stringify(results))

        }

    });
})

module.exports = router;
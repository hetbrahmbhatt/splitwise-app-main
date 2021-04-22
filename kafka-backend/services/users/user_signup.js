var bcrypt = require('bcrypt');
const userSchema = require('../../models/users');
var jwt = require('jsonwebtoken');
var { secret } = require('../../config/config');

function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    bcrypt.hash(req.body.password, 10, (err, hash) => {

        let user = new userSchema({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            language: "",
            phoneno: "",
            image: "",
        })
        user.save().then(response => {
            console.log("Signup successful")
            console.log(response);
            let payload = {
                _id: response._id,
                email: response.email,
                name: response.name,
                defaultcurrency: response.defaultCurrency,
                timezone: response.timezone
            }
            let token = jwt.sign(payload, secret, {
                expiresIn: 1008000
            })
            // res.status(200).send("Bearer " + token)
            console.log("Signup successfull")
            callback(null, "Bearer " + token)
        }).catch(error => {
            console.log("Error", error)
            callback(error, null)
        })
    });


}

exports.handle_request = handle_request;
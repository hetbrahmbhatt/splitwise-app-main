var bcrypt = require('bcrypt');
const userSchema = require('../../models/users');
var jwt = require('jsonwebtoken');
var { secret } = require('../../config/config');

// signup functionality
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
            callback(null, "Bearer " + token)
        }).catch(error => {
            callback(error, null)
        })
    });


}

exports.handle_request = handle_request;
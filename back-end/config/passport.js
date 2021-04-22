var passport = require("passport");
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var users = require('../models/users');
var { secret } = require('../config/config')

function auth() {
    var options = {};
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey = secret;
    passport.use(new JwtStrategy(options, function (jwt_payload, callback) {
        users.findOne({ email: jwt_payload.email }, function (err, user) {
            if (err) {
                return callback(err, false);
            }
            if (user) {
                callback(null, user);
            } else {
                callback(null, false);
            }
        }).catch(error => {
            console.log("Error in auth users", error)
        });
    }));
};
exports.auth = auth;
exports.checkAuth = passport.authenticate('jwt', { session: false })


var bcrypt = require( 'bcrypt' );
const userSchema = require( '../../models/users' );
var jwt = require( 'jsonwebtoken' );
var { secret } = require( '../../config/config' );

// user login
function handle_request ( msg, callback ) {
    let req = {
        body: msg
    }
    userSchema.findOne( { email: req.body.email } ).then( doc => {
        if ( bcrypt.compareSync( req.body.password, doc.password ) ) {
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
            callback(null, "Bearer " + token)
        } else {
            callback( "Invalid credentials", null )
        }

    } ).catch( error => {
        callback(error, null)
    } )


}

exports.handle_request = handle_request;
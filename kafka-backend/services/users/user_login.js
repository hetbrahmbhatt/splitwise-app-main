// var mongo = require( './mongo' );
var bcrypt = require( 'bcrypt' );
const userSchema = require( '../../models/users' );
var jwt = require( 'jsonwebtoken' );
var { secret } = require( '../../config/config' );


function handle_request ( msg, callback ) {
    let req = {
        body: msg
    }
    console.log( "in handle request")
    userSchema.findOne( { email: req.body.email } ).then( doc => {
        if ( bcrypt.compareSync( req.body.password, doc.password ) ) {
            console.log("Login Successful");
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

            console.log("Login Successfull")
            // res.status(200).send("Bearer " + token)// res.status( 200 ).send( "Bearer " + token )
        } else {
            console.log( "Invalid Credentials" )
            // res.status( 401 ).send( "Invalid Credentials" )
            callback( "Invalid credentials", null )
        }

    } ).catch( error => {
        console.log( "User Not Found", error )
        callback(error, null)
    } )


}

exports.handle_request = handle_request;
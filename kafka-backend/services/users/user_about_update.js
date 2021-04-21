const userSchema = require( '../../models/users' );


function handle_request ( msg, callback ) {
    let req = {
        body: msg
    }

    userSchema.findOneAndUpdate( { email: req.body.email },
        {
            $set: {
                name: req.body.name,
                email: req.body.email,
                defaultCurrency: req.body.defaultcurrency,
                timezone: req.body.timezone,
                language: req.body.language,
                phoneno: req.body.phoneno
            }
        }, { new: true }
    ).then( response => {
        console.log( "Update successfull" )
        callback( null, response )
    } ).catch( error => {
        console.log( "Error in update", error )
        callback( error, null )
    } )




}

exports.handle_request = handle_request;
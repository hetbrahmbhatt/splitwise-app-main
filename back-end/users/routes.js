var express = require( 'express' );
var bcrypt = require( 'bcrypt' );
var router = express.Router();
var mongoose = require( '../config/db-config' );
var userSchema = require( '../models/users' );
var jwt = require( 'jsonwebtoken' );
var { secret } = require( '../config/config' );
var kafka = require( '../kafka/client' );
var { auth, checkAuth } = require( '../config/passport' )
auth();

//signup
router.post( '/signup', ( req, res ) => {

    kafka.make_request( 'user_signup', req.body, function ( err, results ) {
        if ( err ) {
            console.log( "Inside err", err );
            res.status( 400 ).send( err )
        } else {
            console.log( "Inside else", results );
            res.status( 200 ).send( results )

        }

    } );
} )

//login
router.post( '/login', ( req, res ) => {
    kafka.make_request( 'user_login', req.body, function ( err, results ) {
        console.log( 'in user_login results' );

        if ( err ) {
            console.log( "Inside err" );
            res.status( 400 ).send( "Invalid Credentials" )
        } else {
            console.log( "Inside else", results );
            res.status( 200 ).send( results )

        }

    } );



} );

// get all users
router.get( '/all', checkAuth, ( req, res ) => {
    kafka.make_request( 'user_getall', req.body, function ( err, results ) {
        if ( err ) {
            console.log( "Inside err" );
            res.status( 400 ).send( "Error Fetching users", err )
        } else {
            console.log( "Inside else", results );
            res.status( 200 ).send( JSON.stringify( results ) )

        }

    } );

} );

//get user about by email
router.get( '/about/:email', checkAuth, ( req, res ) => {
    kafka.make_request( 'user_aboutbyEmail', req.params, function ( err, results ) {
        if ( err ) {
            console.log( "Inside err" );
            res.status( 400 ).send( "Error Fetching users", err )
        } else {
            console.log( "Inside else", results );
            res.status( 200 ).send( JSON.stringify( results ) )

        }

    } );
} ); 


//get user about by id
router.get( '/aboutbyID/:id', checkAuth, ( req, res ) => {
    kafka.make_request( 'user_aboutbyID', req.params, function ( err, results ) {
        if ( err ) {
            console.log( "Inside err" );
            res.status( 400 ).send( "Error Fetching users", err )
        } else {
            console.log( "Inside else", results );
            res.status( 200 ).send( JSON.stringify( results ) )

        }

    } );
} );



//update user about
router.put( '/about', checkAuth, ( req, res ) => {
    kafka.make_request( 'user_about', req.body, function ( err, results ) {
        if ( err ) {
            console.log( "Inside err" );
            res.status( 400 ).send( "Error Fetching users", err )
        } else {
            console.log( "Inside else", results );
            res.status( 200 ).send( JSON.stringify( results ) )

        }

    } );

} );


//upload profile pic
router.post( '/uploadpicture', checkAuth, ( req, res ) => {
    let upload = req.app.get( 'upload_profileImage' );
    upload( req, res, err => {
        if ( err ) {
            console.log( "Error uploading image", err );
            res.status( 400 ).end( 'Issue with uploading' )
        } else {
            console.log( "Inside upload", req.file, req.body );
            req.body.file = req.file
            kafka.make_request( 'upload_picture', req.body, function ( err, results ) {
                if ( err ) {
                    console.log( "Inside err" );
                    res.status( 400 ).send( "Error Fetching users", err )
                } else {
                    console.log( "Inside else", results );
                    res.status( 200 ).send( JSON.stringify( results ) )

                }

            } );


        }
    } );
} );

//follow user
router.post( '/follow', checkAuth, ( req, res ) => {

    console.log( "follow", req.body )
    kafka.make_request( 'user_follow', req.body, function ( err, results ) {
        if ( err ) {
            console.log( "Inside err" );
            res.status( 400 ).send( "Error Fetching users", err )
        } else {
            console.log( "Inside else", results );
            res.status( 200 ).send( JSON.stringify( results ) )

        }

    } );
} )


//reply to message
router.put( '/message', checkAuth, ( req, res ) => {
    kafka.make_request( 'user_message', req.body, function ( err, results ) {
        if ( err ) {
            console.log( "Inside err" );
            res.status( 400 ).send( "Error Fetching users", err )
        } else {
            console.log( "Inside else", results );
            res.status( 200 ).send( JSON.stringify( results ) )

        }

    } );
} )

module.exports = router;
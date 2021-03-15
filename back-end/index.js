const PORT = 4001;

var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var mongoose = require( './config/db-config' );
var { frontend_url } = require( './config/config' )
var path = require( 'path' )
var app = express();
var session = require( "express-session" );
var cookieParser = require( "cookie-parser" );
var cors = require( 'cors' );

//session management
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( express.static( 'public' ) )
app.use( cors( { origin: frontend_url, credentials: true } ) );
app.use(
    session( {
        key: 'user_sid',
        secret: "cmpe_273_lab2",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 6000000
        }
    } )
);
//get index page
app.get( '/', ( req, res ) => {
    res.send( 'Welcome to Splitwise' );
} );
app.listen( PORT, () => {
    console.log( "Server listening on port: ", PORT );
} );

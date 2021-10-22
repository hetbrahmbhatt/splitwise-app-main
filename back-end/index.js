//import the require dependencies
const PORT = process.env.PORT || 3001;
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('./config/db-config');
var { frontend_url } = require('./config/config')
var path = require('path')
const app = express();
var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require('cors');
var user = require('./users/routes')
var groups = require('./groups/routes')
var expenses = require('./expenses/routes')
const dotenv = require('dotenv');
dotenv.config();
// required for fileupload
const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

//use cors to allow cross origin resource sharing
app.use(cors({ origin: frontend_url, credentials: true }));

//use express session to maintain session data
app.use(
    session({
        key: 'user_sid',
        secret: "cmpe_273_lab2",
        resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
        saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
        cookie: {
            expires: 6000000
        }
    })
);

// route the api's to corresponding group of Api's
app.use('/users', user);
app.use('/groups', groups);
app.use('/expenses', expenses);

//get index page
app.get('/', (req, res) => {
    res.send('Welcome to Splitwise');
});

// Start the server
app.listen(PORT, () => {
    console.log("Server listening on port: ", PORT);
});


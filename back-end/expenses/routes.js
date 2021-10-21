// import the require dependencies
var express = require('express');
var router = express.Router();
var kafka = require('../kafka/client');
var { auth, checkAuth } = require('../config/passport')
auth()
const {
    CREATE_EXPENSE,
    GET_TOTAL_GIVING_EXPENSE,
    GET_TOTAL_OWING_EXPENSE,
    GET_TOTAL_INTERNAL_DEBT,
    GET_RECENT_ACTIVITY_FILTER_BASED,
    GET_TOTAL_POSITIVE_BALANCE,
    GET_INTERNAL_GROUP_BALANCE,
    GIVING_SETTLE_UP,
    OWING_SETTLE_UP
  } = require("../kafka/topics");
// add an expense
router.post("/new", checkAuth, (req, res) => {
    kafka.make_request(CREATE_EXPENSE, req.body, function (err, results) {
        if (err) {
            res.status(400).send("Error in creating new expense")
        } else {
            res.status(200).send(results)
        }
    });
})

// get total giving of a particular user
router.post("/totalgiving/:id", checkAuth, (req, res) => {
    kafka.make_request(GET_TOTAL_GIVING_EXPENSE, req.params, function (err, results) {
        if (err) {
            res.status(400).send("Error in getting the total giving amount")
        } else {
            res.status(200).send(results)
        }
    });
});

// get total owing of a particular user
router.post("/totalowing/:id'", checkAuth, (req, res) => {
    kafka.make_request(GET_TOTAL_OWING_EXPENSE, req.params, function (err, results) {
        if (err) {
            res.status(400).send("Error in getting the total owing amount")
        } else {
            res.status(200).send(results)
        }
    });
});

// get total internal debt
router.get("/totalinternaldebt/:id", checkAuth, (req, res) => {
    kafka.make_request(GET_TOTAL_INTERNAL_DEBT, req.params, function (err, results) {
        if (err) {
            res.status(400).send("Error in getting the total internal debt")
        } else {
            res.status(200).send(results)
        }
    });
})

// settle up all giving transactions
router.post("/givingsettleup", checkAuth, (req, res) => {
    kafka.make_request(GIVING_SETTLE_UP, req.body, function (err, results) {
        if (err) {
            res.status(400).send("Error in settling up")
        } else {
            res.status(200).send(results)
        }
    });
})

// settle up all owing transactions
router.post("/owingsettleup", checkAuth, (req, res) => {
    kafka.make_request(OWING_SETTLE_UP, req.body, function (err, results) {
        if (err) {
            res.status(400).send("Error in settling up")
        } else {
            res.status(200).send(results)
        }
    });
})

// get recent-activity 
router.post("/recentactivity", checkAuth, (req, res) => {
    kafka.make_request(GET_RECENT_ACTIVITY_FILTER_BASED, req.body, function (err, results) {
        if (err) {
            res.status(400).send("Error in getting recent activity")
        } else {
            res.status(200).send(results)
        }
    });
});

// get positive total balance
router.get("/gettotalpositivebalance", (req, res) => {
    kafka.make_request(GET_TOTAL_POSITIVE_BALANCE, req.body, function (err, results) {
        if (err) {
            res.status(400).send("Invalid Credentials")
        } else {
            res.status(200).send(results)
        }
    });
})

// get internal group balance 
router.post("/gettotalinternalbalance", (req, res) => {
    kafka.make_request(GET_INTERNAL_GROUP_BALANCE, req.body, function (err, results) {
        if (err) {
            res.status(400).send("Invalid Credentials")
        } else {
            res.status(200).send(results)
        }
    });
})

module.exports = router;
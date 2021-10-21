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
router.post(CREATE_EXPENSE, checkAuth, (req, res) => {
    kafka.make_request('expense_new', req.body, function (err, results) {
        if (err) {
            res.status(400).send("Error in creating new expense")
        } else {
            res.status(200).send(results)
        }
    });
})

// get total giving of a particular user
router.post(GET_TOTAL_GIVING_EXPENSE, checkAuth, (req, res) => {
    kafka.make_request('expense_get_totalgiving', req.params, function (err, results) {
        if (err) {
            res.status(400).send("Error in getting the total giving amount")
        } else {
            res.status(200).send(results)
        }
    });
});

// get total owing of a particular user
router.post(GET_TOTAL_OWING_EXPENSE, checkAuth, (req, res) => {
    kafka.make_request('expense_get_totalowing', req.params, function (err, results) {
        if (err) {
            res.status(400).send("Error in getting the total owing amount")
        } else {
            res.status(200).send(results)
        }
    });
});

// get total internal debt
router.get(GET_TOTAL_INTERNAL_DEBT, checkAuth, (req, res) => {
    kafka.make_request('expense_get_totalinternaldebt', req.params, function (err, results) {
        if (err) {
            res.status(400).send("Error in getting the total internal debt")
        } else {
            res.status(200).send(results)
        }
    });
})

// settle up all giving transactions
router.post(GIVING_SETTLE_UP, checkAuth, (req, res) => {
    kafka.make_request('expense_giving_settleup', req.body, function (err, results) {
        if (err) {
            res.status(400).send("Error in settling up")
        } else {
            res.status(200).send(results)
        }
    });
})

// settle up all owing transactions
router.post(OWING_SETTLE_UP, checkAuth, (req, res) => {
    kafka.make_request('expense_owing_settleup', req.body, function (err, results) {
        if (err) {
            res.status(400).send("Invalid Credentials")
        } else {
            res.status(200).send(results)
        }
    });
})

// get recent-activity 
router.post(GET_RECENT_ACTIVITY_FILTER_BASED, checkAuth, (req, res) => {
    kafka.make_request('expense_filter_recentActivity', req.body, function (err, results) {
        if (err) {
            res.status(400).send("Invalid Credentials")
        } else {
            res.status(200).send(results)
        }
    });
});

// get positive total balance
router.get(GET_TOTAL_POSITIVE_BALANCE, (req, res) => {
    kafka.make_request('expense_get_positivetotalbalance', req.body, function (err, results) {
        if (err) {
            res.status(400).send("Invalid Credentials")
        } else {
            res.status(200).send(results)
        }
    });
})

// get internal group balance 
router.post(GET_INTERNAL_GROUP_BALANCE, (req, res) => {
    kafka.make_request('expense_get_totalinternalbalance', req.body, function (err, results) {
        if (err) {
            res.status(400).send("Invalid Credentials")
        } else {
            res.status(200).send(results)
        }
    });
})

module.exports = router;
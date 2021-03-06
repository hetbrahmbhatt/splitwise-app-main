var connection =  new require('./kafka/connection');
//topic files
//users
var user_login = require('./services/users/user_login');
var user_signup = require('./services/users/user_signup');
var user_about_byID = require('./services/users/user_about_byID');
var user_about_update = require('./services/users/user_about_update');
var user_get_recentActivity = require('./services/users/user_get_recentActivity');
var user_search_email = require('./services/users/user_search_email');
var user_search_name = require('./services/users/user_search_name');


//groups
var group_about_byID = require('./services/groups/group_about_byID');
var group_create = require('./services/groups/group_create');
var group_accept = require('./services/groups/group_accept');
var group_leave = require('./services/groups/group_leave');
var group_update = require('./services/groups/group_update');
var group_get_summary = require('./services/groups/group_get_summary');
var group_add_message = require('./services/groups/group_add_message');
var group_remove_message = require('./services/groups/group_remove_message');


//messages
var expense_new = require('./services/expenses/expense_new');
var expense_get_totalgiving = require('./services/expenses/expense_get_totalgiving');
var expense_get_totalowing = require('./services/expenses/expense_get_totalowing');
var expense_get_totalinternaldebt = require('./services/expenses/expense_get_totalinternaldebt');
var expense_giving_settleup = require('./services/expenses/expense_giving_settleup');
var expense_owing_settleup = require('./services/expenses/expense_owing_settleup');
var expense_filter_recentActivity = require('./services/expenses/expense_filter_recentActivity');
var expense_get_positivetotalbalance = require('./services/expenses/expense_get_positivetotalbalance');
var expense_get_totalinternalbalance = require('./services/expenses/expenses_get_totalinternalbalance');


function handleTopicRequest(topic_name, fname) {
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    consumer.on('message', function (message) {
        var data = JSON.parse(message.value);
        fname.handle_request(data.data, function (err, res) {
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
            });
            return;
        });
    });
}

//users
handleTopicRequest("user_login", user_login)
handleTopicRequest("user_signup", user_signup)
handleTopicRequest("user_about_byID", user_about_byID)
handleTopicRequest("user_about_update", user_about_update)
handleTopicRequest("user_get_recentActivity", user_get_recentActivity)
handleTopicRequest("user_search_email", user_search_email)
handleTopicRequest("user_search_name", user_search_name)

//groups
handleTopicRequest("group_about_byID", group_about_byID)
handleTopicRequest("group_create", group_create)
handleTopicRequest("group_accept", group_accept)
handleTopicRequest("group_leave", group_leave)
handleTopicRequest("group_update", group_update)
handleTopicRequest("group_get_summary", group_get_summary)
handleTopicRequest("group_add_message", group_add_message)
handleTopicRequest("group_remove_message", group_remove_message)


//expense
handleTopicRequest("expense_new", expense_new)
handleTopicRequest("expense_get_totalgiving", expense_get_totalgiving)
handleTopicRequest("expense_get_totalowing", expense_get_totalowing)
handleTopicRequest("expense_get_totalinternaldebt", expense_get_totalinternaldebt)
handleTopicRequest("expense_giving_settleup", expense_giving_settleup)
handleTopicRequest("expense_owing_settleup", expense_owing_settleup)
handleTopicRequest("expense_filter_recentActivity", expense_filter_recentActivity)
handleTopicRequest("expense_get_positivetotalbalance", expense_get_positivetotalbalance)
handleTopicRequest("expense_get_totalinternalbalance", expense_get_totalinternalbalance)


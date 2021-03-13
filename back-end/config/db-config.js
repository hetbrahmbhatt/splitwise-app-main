var mongoose = require('mongoose');
var { mongodb_string } = require('./config')

mongoose.connect(mongodb_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, error => {
    if (error) {
        console.log("Error in connection");
    } else {
        console.log("Successfully Connected");
    }
})

module.exports = {
    mongoose
}
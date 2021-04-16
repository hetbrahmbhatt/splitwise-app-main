const mongoose = require('mongoose')
var Schema = mongoose.Schema;
var membersSchema = new Schema({
    groupID: String,
    userID: String,
    userName: String,
    groupBalance: String
})
var groupSchema = new Schema({
    groupID: String,
    userID: String,
    groupName: { type: String, unique: true, dropDups: true },
    timestamp: String,
    count: Number,
    image: String,
    invitedBy: String,
    membersSchema: [membersSchema]

},
    { collection: 'master_group' }
);

module.exports = mongoose.model('groupSchema', groupSchema);
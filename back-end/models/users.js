const mongoose = require( 'mongoose' )
var Schema = mongoose.Schema;

var individualMessageSchema = new Schema( {
    name: String,
    message: String
} )


var messageSchema = new Schema( {
    userID: String,
    groupID: String,
    groupName: String,
    userName: String,
    conversations: [ individualMessageSchema ]
} )
var invitedGroupSchema = new Schema({
    groupID : String,
    groupName : String,
    invitedBy : String
})
var acceptedGroupSchema = new Schema({
    groupID : String,
    groupName : String,
    invitedBy : String
})

var userSchema = new Schema( {
    name: String,
    email: { type: String, unique: true },
    password: String,
    language: String,
    timezone: String,
    phoneno: String,
    defaultCurrency: {type : String , default : "$"},
    image: String,
    messages: [ messageSchema ],
    invitedGroups : [invitedGroupSchema],
    acceptedGroups : [acceptedGroupSchema]
}
    , { collection: 'users' }
);

module.exports = mongoose.model( 'userSchema', userSchema );  
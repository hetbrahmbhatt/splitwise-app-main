const mongoose = require( 'mongoose' )
var Schema = mongoose.Schema;
var groupSchema = new Schema( {
    groupID: String,
    userID : String,
    groupName : String,
    timestamp : String,
    count : Number,
    image : String,
    invitedBy : String
}
    , { collection: 'master_group' }
);

module.exports = mongoose.model( 'groupSchema', groupSchema );
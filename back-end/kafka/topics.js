
// Users
const USER_LOGIN = "/login";
const USER_SIGNUP = "/signup";
const GET_USER_PROFILE = "/userbyid/:id";
const GET_RECENT_ACTIVITY = "/recentactivity";
const UPLOAD_PROFILE_IMAGE = "/uploadprofileimage";
const EDIT_PROFILE = "/editprofile";

// Expense
const CREATE_EXPENSE = "/new";
const GET_TOTAL_GIVING_EXPENSE = "/totalgiving/:id"; // Update basic group details
const GET_TOTAL_OWING_EXPENSE = "/totalowing/:id'"; // Accept invite
const GET_TOTAL_INTERNAL_DEBT = "/totalinternaldebt/:id"; // Reject invite
const GET_RECENT_ACTIVITY_FILTER_BASED = "/recentactivity"; // Reject invite
const GET_TOTAL_POSITIVE_BALANCE = "postotalbalance/:id"; // Reject invite
const GET_INTERNAL_GROUP_BALANCE = "/internalgroupbalance"; // Reject invite
const GIVING_SETTLE_UP = "/givingsettleup";
const OWING_SETTLE_UP = "/givingsettleup";

// Groups
const GET_GROUP_DETAILS = "/groupbyid/:id";
const CREATE_NEW_GROUP = "/new";
const ACCEPT_GROUP_INVITATION = "/invite";
const LEAVE_GROUP = "/leavegroup";
const UPDATE_GROUP_DETAILS = "/updategroup/";
const GET_GROUP_SUMMARY = "/groupsummarybyid/:id";
const DELETE_MESSAGE = "/removemessage/";
const CREATE_MESSAGE = "/message";
const UPLOAD_PROFILE_IMAGE = "/uploadprofileimage";

// Search
const SEARCH_USER_BY_EMAIL = "searchbyemail";
const SEARCH_USER_BY_NAME = "searchbyname";

module.exports = {
  CREATE_EXPENSE,
  GET_TOTAL_GIVING_EXPENSE,
  GET_TOTAL_OWING_EXPENSE,
  GET_TOTAL_INTERNAL_DEBT,
  GIVING_SETTLE_UP,
  OWING_SETTLE_UP,
  GET_RECENT_ACTIVITY_FILTER_BASED,
  GET_TOTAL_POSITIVE_BALANCE,
  GET_INTERNAL_GROUP_BALANCE,
  USER_SIGNUP,
  USER_LOGIN,
  GET_USER_PROFILE,
  GET_RECENT_ACTIVITY,
  EDIT_PROFILE,
  SEARCH_USER_BY_EMAIL,
  SEARCH_USER_BY_NAME,
  UPLOAD_PROFILE_IMAGE,
  GET_GROUP_DETAILS,
  CREATE_NEW_GROUP,
  ACCEPT_GROUP_INVITATION,
  LEAVE_GROUP,
  UPDATE_GROUP_DETAILS,
  GET_GROUP_SUMMARY,
  DELETE_MESSAGE,
  CREATE_MESSAGE,
};

// Users
const USER_LOGIN = "/login";
const USER_SIGNUP = "/signup";
const GET_USER_PROFILE = "user_about_byID";
const GET_RECENT_ACTIVITY = "user_get_recentActivity";
const UPLOAD_PROFILE_IMAGE = "/uploadprofileimage";
const EDIT_PROFILE = "user_about_update";

// Expense  
const CREATE_EXPENSE = "create_new_expense";
const GET_TOTAL_GIVING_EXPENSE = "expense_get_totalgiving";
const GET_TOTAL_OWING_EXPENSE = "/totalowing/:id'"; 
const GET_TOTAL_INTERNAL_DEBT = "expense_get_totalinternaldebt";
const GIVING_SETTLE_UP = "/recentactivity"; 
const GET_TOTAL_POSITIVE_BALANCE = "postotalbalance/:id";
const GET_INTERNAL_GROUP_BALANCE = "/internalgroupbalance";
const GIVING_SETTLE_UP = "expense_giving_settleup";
const OWING_SETTLE_UP = "expense_owing_settleup";
const GET_INTERNAL_GROUP_BALANCE = "expense_get_totalinternalbalance";

// Groups
const GET_GROUP_DETAILS = "group_about_byID";
const CREATE_NEW_GROUP = "group_create'";
const ACCEPT_GROUP_INVITATION = "group_accept";
const LEAVE_GROUP = "group_leave";
const UPDATE_GROUP_DETAILS = "group_update";
const GET_GROUP_SUMMARY = "group_get_summary";
const DELETE_MESSAGE = "group_remove_message";
const CREATE_MESSAGE = "group_add_message";
const UPLOAD_PROFILE_IMAGE = "/uploadprofileimage";
const UPLOAD_PROFILE_IMAGE = "/uploadprofileimage";
// Search
const SEARCH_USER_BY_EMAIL = "user_search_email";
const GET_RECENT_ACTIVITY_FILTER_BASED = "user_search_name";

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
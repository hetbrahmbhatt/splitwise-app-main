import SignUpReducer from './signupReducer';
import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import getUserProfileReducer from './UserReducers/userUpdateReducer';
import searchEmailReducer from './UserReducers/searchByEmailReducer';
import insertGroupReducer from './groupsReducers/insertGroupReducer';
import recentActivityReducer from './UserReducers/recentActivityReducer';
import getByIDReducer from './UserReducers/getByIDUserReducer';
import getGroupByIDReducer from './groupsReducers/getGroupByIDReducer';
import getGroupByIDReducerForAccepted from './groupsReducers/getGroupByIDForAccepted';
import editGroupReducer from './groupsReducers/editGroupReducer';
import addExpenseReducer from './expenseReducers.js/addExpenseReducer';

var rootReducer = combineReducers({
    SignUpReducer: SignUpReducer,
    loginReducer: loginReducer,
    getUserProfileReducer: getUserProfileReducer,
    searchEmailReducer: searchEmailReducer,
    insertGroupReducer: insertGroupReducer,
    getByIDReducer: getByIDReducer,
    getGroupByIDReducer: getGroupByIDReducer,
    getGroupByIDReducerForAccepted: getGroupByIDReducerForAccepted,
    editGroupReducer: editGroupReducer,
    addExpenseReducer: addExpenseReducer,
    recentActivityReducer: recentActivityReducer,

});

export default rootReducer

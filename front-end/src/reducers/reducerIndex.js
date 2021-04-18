import SignUpReducer from './signupReducer';
import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import getUserProfileReducer from './userReducers/userUpdateReducer';
import searchEmailReducer from './userReducers/searchByEmailReducer';
import insertGroupReducer from './groupsReducers/insertGroupReducer';
import recentActivityReducer from './userReducers/recentActivityReducer';
import getByIDReducer from './userReducers/getByIDUserReducer';
import getGroupByIDReducer from './groupsReducers/getGroupByIDReducer';
import getGroupByIDReducerForAccepted from './groupsReducers/getGroupByIDForAccepted';
import editGroupReducer from './groupsReducers/editGroupReducer';
import addExpenseReducer from './expenseReducers.js/addExpenseReducer';
import groupSummaryByIDReducer from './groupsReducers/groupSummaryByIDReducer';
import getInternalDebtReducer from './groupsReducers/getInternalDebtReducer';

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
    groupSummaryByIDReducer: groupSummaryByIDReducer,
    getInternalDebtReducer: getInternalDebtReducer,

});

export default rootReducer

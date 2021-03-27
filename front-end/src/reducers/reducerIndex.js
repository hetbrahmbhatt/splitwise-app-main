import SignUpReducer from './signupReducer';
import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import getUserProfileReducer from './UserReducers/userUpdateReducer';
import searchEmailReducer from './UserReducers/searchByEmailReducer';

var rootReducer = combineReducers( {
    SignUpReducer: SignUpReducer,
    loginReducer: loginReducer,
    getUserProfileReducer: getUserProfileReducer,
    searchEmailReducer: searchEmailReducer,


});

export default rootReducer

import SignUpReducer from './signupReducer';
import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import getUserProfileReducer from './UserReducers/userUpdateReducer';

var rootReducer = combineReducers( {
    SignUpReducer: SignUpReducer,
    loginReducer: loginReducer,
    getUserProfileReducer: getUserProfileReducer,

});

export default rootReducer

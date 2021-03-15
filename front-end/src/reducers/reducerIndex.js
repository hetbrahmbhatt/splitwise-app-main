import SignUpReducer from './signupReducer';
import { combineReducers } from 'redux';
import loginReducer from './loginReducer';

var rootReducer = combineReducers( {
    SignUpReducer: SignUpReducer,
    loginReducer: loginReducer,
});

export default rootReducer

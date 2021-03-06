import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";


const USER_PROFILE_UPDATE_SUCCESS = "user_profile_update_success";
const USER_PROFILE_UPDATE_FAILED = "user_profile_update_failed";
var success = (response) => {
    return {
        type: USER_PROFILE_UPDATE_SUCCESS,
        payload: {
            response: response,
        }
    }
}
var error = (err) => {
    return {
        type: USER_PROFILE_UPDATE_FAILED,
        payload: {
            response: err
        }
    }
}
var updateUserProfileAction = (data) => (dispatch) => {
    axios.defaults.headers.common[ "authorization" ] = cookie.load( 'token' )
    axios.defaults.withCredentials = true;
    return axios
        .put(BACKEND_URL + "/users/editprofile", data).then(response => {
            if (response.status === 200) {
                if (cookie.load('email') !== response.data.email) {
                    cookie.remove("email", {
                        path: '/'
                    });
                    cookie.save("email", response.data.email, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    })
                }
                if (cookie.load('name') !== response.data.name) {
                    cookie.remove("name", {
                        path: '/'
                    });
                    cookie.save("name", response.data.name, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    })
                }
                if (cookie.load('defaultcurrency') !== response.data.defaultCurrency) {
                    cookie.remove("defaultcurrency", {
                        path: '/'
                    });
                    cookie.save("defaultcurrency", response.data.defaultCurrency, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    })
                }
                if (cookie.load('timezone') !== response.data.timezone) {
                    cookie.remove("timezone", {
                        path: '/'
                    });
                    cookie.save("timezone", response.data.timezone, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    })
                }
                dispatch(success(response))
            }
        }).catch(err => {
            dispatch(error(err))
        })
}

export default updateUserProfileAction
import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";
import jwt_decode from "jwt-decode"
const LOGIN_SUCCESS = "login_success";
const LOGIN_FAILED = "login_failed";

var successUser = (response, data) => {
    return {
        type: LOGIN_SUCCESS,
        payload: {
            response: response,
            data: data
        }
    }
}

var errorUser = (err, data) => {
    return {
        type: LOGIN_FAILED,
        payload: {
            response: err,
            data: data
        }
    }
}


var loginAction = (data) => (dispatch) => {
    axios
        .post(BACKEND_URL + '/users/login', data)
        .then((response) => {
            let decoded = jwt_decode(response.data.split(' ')[1])
            console.log("decoded", decoded)
            if (response.status === 200) {
                cookie.save( "token", response.data, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                } )
                cookie.save("auth", true, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                cookie.save("id", decoded._id, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                cookie.save("name", decoded.name, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                cookie.save("email", decoded.email, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                cookie.save("defaultcurrency", decoded.defaultcurrency, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                cookie.save("timezone", decoded.timezone, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                dispatch(successUser(response, data));
            }
        })
        .catch((err) => {
            dispatch(errorUser(err, data))
        });
}

export default loginAction
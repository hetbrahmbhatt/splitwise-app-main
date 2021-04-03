import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";
import jwt_decode from "jwt-decode"

const SIGNUP_SUCCESS = "signup_success";
const SIGNUP_FAILED = "signup_failed";

var successUser = (response, data) => {
    return {
        type: SIGNUP_SUCCESS,
        payload: {
            response: response,
            data: data
        }
    }
}

var errorUser = (err, data) => {
    return {
        type: SIGNUP_FAILED,
        payload: {
            response: err,
            data: data
        }
    }
}


var SignUpAction = (data) => (dispatch) => {
    axios
        .post(BACKEND_URL + '/users/signup', data)
        .then((response) => {
            if (response.status === 200) {
                console.log(response.data);
                let decoded = jwt_decode(response.data.split(' ')[1])

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
                    cookie.save("timezone", "American/Los_Angeles", {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    })
                    dispatch(successUser(response, data))
                }
            }
        }).catch((err) => {
            dispatch(errorUser(err, data))
        });
}

export default SignUpAction
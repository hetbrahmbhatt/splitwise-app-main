import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";
const OWING_SETTLE_UP_SUCCESS = "owing_settle_up_success";
const OWING_SETTLE_UP_FAIL = "owing_settle_up_fail";
var success = (response) => {
    return {
        type: OWING_SETTLE_UP_SUCCESS,
        payload: {
            response: response,
        }
    }
}
var error = (err) => {
    return {
        type: OWING_SETTLE_UP_FAIL,
        payload: {
            response: err
        }
    }
}
var owingsettleupAction = (data) => (dispatch) => {
    axios.defaults.headers.common["authorization"] = cookie.load('token')
    axios.defaults.withCredentials = true;
    return axios.post(BACKEND_URL + "/expenses/owingsettleup", data).then(response => {
        dispatch(success(response));
    }).catch((err) => {
        dispatch(error(err))
    });
}

export default owingsettleupAction
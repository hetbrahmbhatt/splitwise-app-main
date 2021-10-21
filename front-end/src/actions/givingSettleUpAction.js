import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";
const SETTLE_UP_SUCCESS = "settle_up_success";
const SETTLE_UP_FAIL = "settle_up_fail";
var success = (response) => {
    return {
        type: SETTLE_UP_SUCCESS,
        payload: {
            response: response,
        }
    }
}

var error = (err) => {
    return {
        type: SETTLE_UP_FAIL,
        payload: {
            response: err
        }
    }
}
var settleupAction = (data) => (dispatch) => {
    axios.defaults.headers.common["authorization"] = cookie.load('token')
    axios.defaults.withCredentials = true;
    return axios.post(BACKEND_URL + "/expenses/givingsettleup", data).then(response => {

        // window.location.reload();
        dispatch(success(response));

    }).catch((err) => {
        dispatch(error(err))
    });
}

export default settleupAction
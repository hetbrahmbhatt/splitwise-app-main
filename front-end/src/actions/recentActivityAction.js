import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";

const RECENT_ACTIVITY_SUCCESS = "recent_activity_success";
const RECENT_ACTIVITY_FAIL = "recent_activity_fail";
var success = (response) => {
    return {
        type: RECENT_ACTIVITY_SUCCESS,
        payload: {
            response: response,
        }
    }
}
var error = (err) => {
    return {
        type: RECENT_ACTIVITY_FAIL,
        payload: {
            response: err
        }
    }
}
var recentActivityAction = (data) => (dispatch) => {
    axios.defaults.headers.common["authorization"] = cookie.load('token')
    axios.defaults.withCredentials = true;
    return axios
        .post(BACKEND_URL + "/expenses/recentactivity/", data).then(response => {
            if (response.status === 200) {
                let pageCount = Math.ceil(response.data.length / data.perPage)
                dispatch(success(response, pageCount));
            }
        }).catch((err) => {
            dispatch(error(err))
        });
}

export default recentActivityAction
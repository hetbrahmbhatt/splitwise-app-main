import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";


const USER_SEARCH_EMAIL_SUCCESS = "user_search_email_success";
const USER_SEARCH_EMAIL_FAILED = "user_search_email_failed";
var success = (response) => {
    return {
        type: USER_SEARCH_EMAIL_SUCCESS,
        payload: {
            response: response,
        }
    }
}

var error = (err) => {
    return {
        type: USER_SEARCH_EMAIL_FAILED,
        payload: {
            response: err
        }
    }
}
var getAutoCompleteEmail = (data,callback) => (dispatch) => {
    axios.defaults.headers.common["authorization"] = cookie.load('token')
    axios.defaults.withCredentials = true;
    axios.get(BACKEND_URL + "/users/searchbyemail?email_like=" + data).then((response) => {
        let obj = response.data.map(i => ({
            label: i.email,
            value: i._id
        }));
        dispatch(success(response.data, obj));

    }).catch((err) => {
        dispatch(error(err, data));
    });
}

export default getAutoCompleteEmail
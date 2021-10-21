import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";


const GRPOUP_GET_SUCCESS = "group_get_success";
const GROUP_GET_FAIL = "group_get_fail";
var success = (response) => {
    return {
        type: GRPOUP_GET_SUCCESS,
        payload: {
            response: response,
        }
    }
}

var error = (err) => {
    return {
        type: GROUP_GET_FAIL,
        payload: {
            response: err
        }
    }
}
var groupGetByIDActionForAccepted = (data) => (dispatch) => {
    axios.defaults.headers.common["authorization"] = cookie.load('token')
    axios.defaults.withCredentials = true;
    return  axios
        .get(BACKEND_URL + "/groups/groupbyid/" + data).then(response => {
            if (response.status === 200) {
                dispatch(success(response, data));

            }
        }).catch((err) => {
            dispatch(error(err, data))
        });
}

export default groupGetByIDActionForAccepted
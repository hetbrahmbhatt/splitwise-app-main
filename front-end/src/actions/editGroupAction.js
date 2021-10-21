import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";


const GRPOUP_EDIT_SUCCESS = "group_edit_success";
const GROUP_EDIT_FAIL = "group_edit_fail";
var success = (response) => {
    return {
        type: GRPOUP_EDIT_SUCCESS,
        payload: {
            response: response,
        }
    }
}

var error = (err) => {
    return {
        type: GROUP_EDIT_FAIL,
        payload: {
            response: err
        }
    }
}
var editGroupAction = (data) => (dispatch) => {
    axios.defaults.headers.common["authorization"] = cookie.load('token')
    axios.defaults.withCredentials = true;
    return  axios
        .put(BACKEND_URL + "/groups/updategroup/" ,data).then(response => {
            if (response.status === 200) {
                dispatch(success(response, data));
            }
        }).catch((err) => {
            dispatch(error(err, data))
        });
}

export default editGroupAction
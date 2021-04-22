import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";
import { Link } from 'react-router-dom';

// let redirectTo = <Link  to={{ pathname: "/all-group" }}></Link>;
const GRPOUP_ADD_SUCCESS = "group_add_success";
const GROUP_ADD_FAIL = "group_add_fail";
var success = (response) => {
    return {
        type: GRPOUP_ADD_SUCCESS,
        payload: {
            response: response,
        }
    }
}

var error = (err) => {
    console.log("err", err)
    return {
        type: GROUP_ADD_FAIL,
        payload: {
            response: err
        }
    }
}
var groupAddAction = (data) => (dispatch) => {
    axios.defaults.headers.common["authorization"] = cookie.load('token')
    axios.defaults.withCredentials = true;
    axios
        .post(BACKEND_URL + "/groups/new", data).then(response => {
            if (response.status === 200) {
                // alert("HI");
                window.location.assign("/all-group");
            }

        }).catch((err) => {
            dispatch(error(err, data))
        });
}

export default groupAddAction
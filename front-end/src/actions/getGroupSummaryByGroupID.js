import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";


const GROUP_SUMMARY_SUCCESS = "group_summary_success";
const GROUP_SUMMARY_FAIL = "group_summary_fail";
var success = (response) => {
    return {
        type: GROUP_SUMMARY_SUCCESS,
        payload: {
            response: response,
        }
    }
}

var error = (err) => {
    console.log("err", err)
    return {
        type: GROUP_SUMMARY_FAIL,
        payload: {
            response: err
        }
    }
}
var groupSummaryByIDAction = (data) => (dispatch) => {
    axios.defaults.headers.common["authorization"] = cookie.load('token')
    axios.defaults.withCredentials = true;
    console.log(data);
    return axios
        .get(BACKEND_URL + "/groups/groupsummarybyid/" + data.groupID).then(response => {
            if (response.status === 200) {
                console.log(response.data)
                dispatch(success(response, data));

            }
        }).catch((err) => {
            dispatch(error(err, data))
        });
}

export default groupSummaryByIDAction
import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";


const DEBT_GET_SUCCESS = "debt_get_success";
const DEBT_GET_FAIL = "debt_get_fail";
var success = (response) => {
    return {
        type: DEBT_GET_SUCCESS,
        payload: {
            response: response,
        }
    }
}

var error = (err) => {
    return {
        type: DEBT_GET_FAIL,
        payload: {
            response: err
        }
    }
}
var debtGetByIDAction = (data) => (dispatch) => {
    axios.defaults.headers.common["authorization"] = cookie.load('token')
    axios.defaults.withCredentials = true;
    return axios
        .get(BACKEND_URL + "/expenses/totalinternaldebt/" + data).then(response => {
            if (response.status === 200) {
                dispatch(success(response, data));

            }
        }).catch((err) => {
            dispatch(error(err, data))
        });
}

export default debtGetByIDAction
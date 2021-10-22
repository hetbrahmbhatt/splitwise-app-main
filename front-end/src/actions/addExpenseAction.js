import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";

const EXPENSE_ADD_SUCCESS = "expense_add_success";
const EXPENSE_ADD_FAIL = "expense_add_fail";
var success = (response) => {
    return {
        type: EXPENSE_ADD_SUCCESS,
        payload: {
            response: response,
        }
    }
}
var error = (err) => {
    return {
        type: EXPENSE_ADD_FAIL,
        payload: {
            response: err
        }
    }
}
var addExpenseAction = (data) => (dispatch) => {
    axios.defaults.headers.common["authorization"] = cookie.load('token')
    axios.defaults.withCredentials = true;
    return axios
        .post(BACKEND_URL + "/expenses/new", data).then(response => {
            if (response.status === 200) {
                dispatch(success(response));
                window.location.reload();
            }
        }).catch((err) => {
            dispatch(error(err))
        });
}

export default addExpenseAction
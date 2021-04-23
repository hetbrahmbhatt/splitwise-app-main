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
    console.log("err", err)
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
    console.log(data);
    return axios
        .post(BACKEND_URL + "/expenses/new", data).then(response => {
            console.log(response);
            if (response.status === 200) {
                dispatch(success(response));
                alert("Over here");
                window.location.reload();

            }
        }).catch((err) => {
            dispatch(error(err))
        });
}

export default addExpenseAction
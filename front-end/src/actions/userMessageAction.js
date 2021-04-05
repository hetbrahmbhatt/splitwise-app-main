import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";


const USER_MESSAGE_SUCCESS = "user_message_success";
const USER_MESSAGE_FAILED = "user_message_failed";

var success = (response, imagePath) => {
    return {
        type: USER_MESSAGE_SUCCESS,
        payload: {
            response: response,
            imagePath: imagePath
        }
    }
}

var error = (err) => {
    console.log("err", err)
    return {
        type: USER_MESSAGE_FAILED,
        payload: {
            response: err,
        }
    }
}


var userMessageAction = (data) => (dispatch) => {
    console.log("data", data)
    axios.defaults.headers.common["authorization"] = cookie.load('token')
    axios.defaults.withCredentials = true;
    return axios.put(BACKEND_URL + '/groups/message', data).then(response => {
        console.log(response.data);
        dispatch(success(response, data))
    }).catch(err => {
        dispatch(error(err))
    })





}



export default userMessageAction
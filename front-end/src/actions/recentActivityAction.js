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
    console.log("err", err)
    return {
        type: RECENT_ACTIVITY_FAIL,
        payload: {
            response: err
        }
    }
}
var recentActivityAction = (perPage) => (dispatch) => {
    axios.defaults.headers.common["authorization"] = cookie.load('token')
    axios.defaults.withCredentials = true;
    return axios
        .get(BACKEND_URL + "/expenses/recentactivity/" + cookie.load('id')).then(response => {
            if (response.status === 200) {
                console.log(response);
                let pageCount = Math.ceil( response.data.length / perPage )
                dispatch(success(response, pageCount));
            }
        }).catch((err) => {
            dispatch(error(err))
        });
    //         const formData = new FormData();
    //         formData.append('profileImage', this.state.updatedProfileImage, this.state.updatedProfileImage.name + "," + response.data.groupID)
    //         const config = {
    //             headers: {
    //                 'content-type': 'multipart/form-data'
    //             }
    //         }
    //         axios
    //             .post(BACKEND_URL + '/groups/uploadprofileimage', formData, config).then((response) => {
    //                 this.setState({
    //                     profileImagePath: BACKEND_URL + '/images/grouppics/' + response.data.groupID + '/' + response.data.fileName

    //                 })

    //             }).catch(err => {
    //                 toast.error("Error in image upload")
    //             })
    //     }

    // }).catch(err => {
    //     if (err.response == null) {

    //     }
    //     else
    //         toast.error(err.response.data);
    // })
}

export default recentActivityAction
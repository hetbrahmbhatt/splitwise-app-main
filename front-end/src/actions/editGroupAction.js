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
    console.log("err", err)
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
    console.log(data);
    return  axios
        .put(BACKEND_URL + "/groups/updategroup/" ,data).then(response => {
            if (response.status === 200) {
                dispatch(success(response, data));
            }
        }).catch((err) => {
            dispatch(error(err, data))
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

export default editGroupAction
let initialState = {
    userData: {},
    profileImagePath: "",
    error: false,
    update: false,

}
var getUserProfileReducer = ( state = initialState, action ) => {
    let newState = { ...state }

    switch ( action.type ) {
        case "user_profile_success":
            newState.userData = action.payload.response.data;
            newState.profileImagePath = action.payload.imagePath;
            return newState;

        case "user_profile_failed":
            newState.error = true;
            newState.message = "Could Not get profile!"
            return newState;

        case "user_profile_update_success":
            newState.update = true;
            newState.message = "User Profile Update Successful";
            newState.userData = action.payload.response.data;
            return newState;

        case "user_profile_update_failed":
            newState.update = false;
            newState.message = "Update Failed";
            newState.useData = action.payload.response.data;
            return newState;

        case "user_message_success":
            newState.userData = action.payload.response.data;
            return newState;

        case "user_message_failed":
            newState.error = true;
            newState.message = "Reply failed!"
            return newState;
        default:
            return newState;


    }
}

export default getUserProfileReducer
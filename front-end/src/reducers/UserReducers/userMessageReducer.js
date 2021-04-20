let initialState = {
    userMessageData: {},
    error: "",
}
var userMessageReducer = (state = initialState, action) => {
    console.log(action.payload)
    let newState = { ...state }

    switch (action.type) {
        case "user_message_success":
            newState.error = false;
            newState.userMessageData = action.payload.response.data;
            return newState;

        case "user_message_failed":
            newState.error = true;
            newState.message = "Reply failed!"
            return newState;
        default:
            return newState;


    }
}

export default userMessageReducer
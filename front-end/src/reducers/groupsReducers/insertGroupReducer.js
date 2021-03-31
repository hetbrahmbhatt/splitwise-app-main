let initialState = {
    groupID : "",
    error: false,
}
var insertGroupReducer = ( state = initialState, action ) => {
    console.log(action.payload)
    let newState = { ...state }
    switch ( action.type ) {
        case "group_add_success":
            newState.groupID = action.payload.response.groupID;
            newState.error = false;
            return newState;
        case "group_add_fail":
            newState.error = true;
            newState.message = "!"
            return newState;
        default:
            return newState;
    }
}

export default insertGroupReducer
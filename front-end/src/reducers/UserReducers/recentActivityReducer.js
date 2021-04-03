let initialState = {
    userData: {},
    error: false,
}
var recentActivityReducer = ( state = initialState, action ) => {
    console.log(action.payload)
    let newState = { ...state }
    switch ( action.type ) {
        case "recent_activity_success":
            newState.userData = action.payload.response;
            newState.error = false;
            return newState;
        case "recent_activity_fail":
            newState.error = true;
            newState.message = "Error in the database server"
            return newState;
        default:
            return newState;
    }
}

export default recentActivityReducer
let initialState = {
    emailData: {},
    error: false,
}
var searchEmailReducer = ( state = initialState, action ) => {
    let newState = { ...state }
    switch ( action.type ) {
        case "user_search_email_success":
            newState.emailData = action.payload.response;
            newState.error = false;
            return newState;
        case "user_search_email_failed":
            newState.error = true;
            newState.message = "Search Failed!"
            return newState;
        default:
            return newState;
    }
}

export default searchEmailReducer
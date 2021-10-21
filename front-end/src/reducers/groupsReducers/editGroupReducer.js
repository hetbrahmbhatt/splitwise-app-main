let initialState = {
    groupData : {},
    error: false,
}
var editGroupReducer = ( state = initialState, action ) => {
    let newState = { ...state }
    switch ( action.type ) {
        case "group_edit_success":
            newState.groupData = action.payload.response.data;
            newState.error = false;
            return newState;
        case "group_edit_fail":
            newState.error = true;
            newState.message = "!"
            return newState;
        default:
            return newState;
    }
}

export default editGroupReducer
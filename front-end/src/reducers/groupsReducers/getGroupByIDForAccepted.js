let initialState = {
    groupData : {},
    error: false,
}
var getGroupByIDReducerForAccepted = ( state = initialState, action ) => {
    let newState = { ...state }
    switch ( action.type ) {
        case "group_get_success":
            newState.groupData = action.payload.response.data;
            newState.error = false;
            return newState;
        case "group_get_fail":
            newState.error = true;
            newState.message = "Group Getting Fail"
            return newState;
        default:
            return newState;
    }
}

export default getGroupByIDReducerForAccepted
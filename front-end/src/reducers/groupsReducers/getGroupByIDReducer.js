let initialState = {
    groupData : {},
    error: false,
}
var getGroupByIDReducer = ( state = initialState, action ) => {
    console.log(action.payload)
    let newState = { ...state }
    switch ( action.type ) {
        case "group_get_success":
            newState.groupData = action.payload.response;
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

export default getGroupByIDReducer
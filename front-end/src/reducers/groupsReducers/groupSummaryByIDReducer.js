let initialState = {
    groupSummaryData : {},
    error: false,
}
var groupSummaryByIDReducer = ( state = initialState, action ) => {
    console.log(action.payload)
    let newState = { ...state }
    switch ( action.type ) {
        case "group_summary_success":
            newState.groupSummaryData = action.payload.response;
            newState.error = false;
            return newState;
        case "group_summary_fail":
            newState.error = true;
            return newState;
        default:
            return newState;
    }
}

export default groupSummaryByIDReducer
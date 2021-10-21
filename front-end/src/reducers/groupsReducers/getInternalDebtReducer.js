let initialState = {
    internalData: {},
    error: false,
}
var getTotalInternalDebt = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        case "debt_get_success":
            newState.internalData = action.payload.response;
            newState.error = false;
            return newState;
        case "debt_get_fail":
            newState.error = true;
            newState.message = "Group Getting Fail"
            return newState;
        default:
            return newState;
    }
}

export default getTotalInternalDebt
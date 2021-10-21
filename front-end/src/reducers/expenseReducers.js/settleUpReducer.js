let initialState = {
    settleUpData: {},
    error: false,
    message: ""
}
var givingsettleUpReducer = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        case "settle_up_success":
            newState.settleUpData = action.payload.response.data;
            newState.error = false;
            newState.message = "Giving Settled Up Succesfully."
            return newState;
        case "settle_up_fail":
            newState.error = true;
            newState.message = "Settled Up Fail."
            return newState;
        default:
            return newState;
    }
}

export default givingsettleUpReducer
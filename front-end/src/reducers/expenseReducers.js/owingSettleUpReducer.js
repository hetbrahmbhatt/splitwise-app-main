let initialState = {
    owingsettleUpData: {},
    error: false,
    message: ""
}
var owingSettleUpReducer = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        case "owing_settle_up_success":
            newState.settleUpData = action.payload.response.data;
            newState.error = false;
            newState.message = "Owing Settled Up Succesfully."
            return newState;
        case "owing_settle_up_fail":
            newState.error = true;
            newState.message = "Settled Up Fail."
            return newState;
        default:
            return newState;
    }
}

export default owingSettleUpReducer
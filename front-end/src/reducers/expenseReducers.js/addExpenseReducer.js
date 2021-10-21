let initialState = {
    expenseData: {},
    error: false,
}
var addActionReducer = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        case "expense_add_success":
            newState.expenseData = action.payload.response.data;
            newState.error = false;
            return newState;
        case "expense_add_fail":
            newState.error = true;
            newState.message = "!"
            return newState;
        default:
            return newState;
    }
}

export default addActionReducer
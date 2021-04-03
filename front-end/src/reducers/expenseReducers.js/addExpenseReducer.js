let initialState = {
    expenseData : {},
    error: false,
}
var addActionReducer = ( state = initialState, action ) => {
    console.log(action.payload)
    let newState = { ...state }
    switch ( action.type ) {
        case "expense_add_success":
            newState.groupData = action.payload.response.data;
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
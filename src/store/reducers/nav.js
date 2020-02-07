import * as actionTypes from "../actions/actionTypes";
import {updateObject} from "../utility";

const initialState = {
    namePopup: null,
    showPopup: false,
};

const openPopup = (state, action) => {
    return updateObject(state, {showPopup: true, namePopup: action.namePopup});
};

const closePopup = (state, action) => {

    return updateObject(state, {showPopup: false, namePopup: null});
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.OPEN_POPUP:
            return openPopup(state, action);
        case actionTypes.CLOSE_POPUP:
            return closePopup(state, action);
        default:
            return state;
    }
};

export default reducer;
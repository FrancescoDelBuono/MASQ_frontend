import * as actionTypes from "./actionTypes";

export const openPopup = (namePopup) => {
    return {
        type: actionTypes.OPEN_POPUP,
        namePopup: namePopup
    };
};

export const closePopup = () => {
    return {
        type: actionTypes.CLOSE_POPUP
    };
};

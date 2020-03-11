import * as actionTypes from "./actionTypes";

export const openPopup = (namePopup, data) => {
    return {
        type: actionTypes.OPEN_POPUP,
        namePopup: namePopup,
        data: data,
    };
};

export const closePopup = () => {
    return {
        type: actionTypes.CLOSE_POPUP
    };
};

export const openComparePopup = (idSCenarios) => {
    return {
        type: actionTypes.OPEN_COMPARE_POPUP,
        idScenarios: idSCenarios
    };
};

export const closeComparePopup = () => {
    return {
        type: actionTypes.CLOSE_COMPARE_POPUP
    };
};

export const setIsSimulation = (isSimulation) => {
    return {
        type: actionTypes.SET_IS_SIMULATION,
        isSimulation: isSimulation
    };
};

export const setStep = (step) => {
    return {
        type: actionTypes.SET_STEP,
        step: step,
    };
};

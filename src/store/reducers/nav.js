import * as actionTypes from "../actions/actionTypes";
import {updateObject} from "../utility";

const initialState = {
    showPopup: false,
    namePopup: null,
    data: null,

    showComparePopup: false,
    idScenarios: [],

    currentStep: 0,
    isSimulation: false,
};

const openPopup = (state, action) => {
    return updateObject(state, {
        showPopup: true,
        namePopup: action.namePopup,
        data: action.data,
    });
};

const closePopup = (state, action) => {

    return updateObject(state, {
        showPopup: false,
        namePopup: null,
        data: null,
    });
};

const openComparePopup = (state, action) => {
    return updateObject(state, {
        showComparePopup: true,
        idScenarios: action.idScenarios,
    });
};

const closeComparePopup = (state, action) => {

    return updateObject(state, {
        showComparePopup: false,
        idScenarios: [],
    });
};

const setIsSimulation = (state, action) => {
    return updateObject(state, {
        isSimulation: action.isSimulation,
    });
};

const setStep = (state, action) => {
    return updateObject(state, {
        currentStep: action.step,
    });
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.OPEN_POPUP:
            return openPopup(state, action);
        case actionTypes.CLOSE_POPUP:
            return closePopup(state, action);
        case actionTypes.OPEN_COMPARE_POPUP:
            return openComparePopup(state, action);
        case actionTypes.CLOSE_COMPARE_POPUP:
            return closeComparePopup(state, action);
        case actionTypes.SET_IS_SIMULATION:
            return setIsSimulation(state, action);
        case actionTypes.SET_STEP:
            return setStep(state, action);
        default:
            return state;
    }
};

export default reducer;
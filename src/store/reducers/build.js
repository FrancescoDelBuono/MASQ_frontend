import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
    isDB: null,
    dataset: null,
    dbUrl: null,
    tables: null,
    table: null,
    columns: null,

    error: null,
    loading: false,

    mode: 'train',
    labelsType: null,
    labels: null,

    modelsList: [],
    transformsList: [],
    model: null,
    transforms: null,
    pipeline: null,
    runDB: false,
};

// DATASET reducers
const datasetStart = (state, action) => {
    return updateObject(state, {error: null, loading: true});
};

const datasetUploadSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: false,
        dataset: action.dataset,
        columns: action.columns,
        isDB: action.isDB,
    });
};

const datasetRemoveUpload = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: false,
        dataset: action.dataset,
        columns: action.columns,
        isDB: action.isDB,
    });
};

const datasetCheckUrlSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: false,
        dbUrl: action.dbUrl,
        tables: action.tables,
        isDB: action.isDB,
    });
};

const datasetSelectTableSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: false,
        table: action.table,
        columns: action.columns,
    });
};

const datasetFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

// MODALITY reducers
const modalityChangeMode = (state, action) => {
    return updateObject(state, {
        mode: action.mode,
    });
};

const modalitySetLabels = (state, action) => {
    return updateObject(state, {
        labelsType: action.labelsType,
        labels: action.labels
    });
};

const modalitySetValidation = (state, action) => {
    return updateObject(state, {
        validation: action.validation,
    });
};

// MODEL reducers
const modelStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    });
};

const modelFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const modelGetModelsSuccess = (state, action) => {
    return updateObject(state, {
        modelsList: action.modelsList,
        loading: false,
    });
};

const modelGetTransformsSuccess = (state, action) => {
    return updateObject(state, {
        transformsList: action.transformsList,
        loading: false,
    });
};

const modelSetModel = (state, action) => {
    return updateObject(state, {
        model: action.model,
    });
};

const modelSetTransforms = (state, action) => {
    return updateObject(state, {
        transforms: action.transforms,
    });
};

const modelAddTransform = (state, action) => {
    return updateObject(state, {
        transforms: [...state.transforms ,...action.transform],
    });
};

const modelRemoveTransform = (state, action) => {
    let res = state.transaction;
    res.splice(action.index, 1);

    return updateObject(state, {
        transforms: res,
    });
};

const modelUploadPipeline = (state, action) => {
    return updateObject(state, {
        pipeline: action.pipeline,
    });
};

const modelRemovePipeline = (state, action) => {
    return updateObject(state, {
        pipeline: null,
    });
};

const modelChangeRunDB = (state, action) => {
    return updateObject(state, {
        runDB: action.runDB,
    });
};

const builderSet = (state, action) => {
    return updateObject(state, {
        isDB: action.scenario.isDB,
        dataset: action.scenario.dataset,
        dbUrl: action.scenario.dbUrl,
        tables: action.scenario.tables,

        table: action.scenario.table,
        columns: action.scenario.columns,

        error: null,
        loading: false,

        mode: action.scenario.mode,
        labelsType: action.scenario.labelsType,
        labels: action.scenario.labels,

        model: action.scenario.model,
        transforms: action.scenario.transforms,

        pipeline: action.scenario.pipeline,
        runDB: action.scenario.runDB,
    });
};


// REDUCER
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.DATASET_START:
            return datasetStart(state, action);
        case actionTypes.DATASET_UPLOAD_SUCCESS:
            return datasetUploadSuccess(state, action);
        case actionTypes.DATASET_REMOVE_UPLOAD:
            return datasetRemoveUpload(state, action);
        case actionTypes.DATASET_CHECK_URL_SUCCESS:
            return datasetCheckUrlSuccess(state, action);
        case actionTypes.DATASET_SELECT_TABLE_SUCCESS:
            return datasetSelectTableSuccess(state, action);
        case actionTypes.DATASET_FAIL:
            return datasetFail(state, action);
        case actionTypes.MODALITY_CHANGE_MODE:
            return modalityChangeMode(state, action);
        case actionTypes.MODALITY_SET_LABELS:
            return modalitySetLabels(state, action);
        case actionTypes.MODALITY_SET_VALIDATION:
            return modalitySetValidation(state, action);
        case actionTypes.MODEL_START:
            return modelStart(state, action);
        case actionTypes.MODEL_FAIL:
            return modelFail(state, action);
        case actionTypes.MODEL_GET_MODELS_SUCCESS:
            return modelGetModelsSuccess(state, action);
        case actionTypes.MODEL_GET_TRANSFORMS_SUCCESS:
            return modelGetTransformsSuccess(state, action);
        case actionTypes.MODEL_SET_MODEL:
            return modelSetModel(state, action);
        case actionTypes.MODEL_SET_TRANSFORMS:
            return modelSetTransforms(state, action);
        case actionTypes.MODEL_ADD_TRANSFORM:
            return modelAddTransform(state, action);
        case actionTypes.MODEL_REMOVE_TRANSFORM:
            return modelRemoveTransform(state, action);
        case actionTypes.MODEL_UPLOAD_PIPELINE:
            return modelUploadPipeline(state, action);
        case actionTypes.MODEL_REMOVE_PIPELINE:
            return modelRemovePipeline(state, action);
        case actionTypes.MODEL_CHANGE_RUN_DB:
            return modelChangeRunDB(state, action);
        case actionTypes.BUILDER_SET:
            return builderSet(state, action);
        default:
            return state;
    }
};

export default reducer;
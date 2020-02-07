import * as actionTypes from './actionTypes';

// DATASET actions
export const datasetStart = () => {
    return {
        type: actionTypes.DATASET_START
    }
};

export const datasetUploadSuccess = (dataset, columns) => {
    console.log(dataset[0].name)
    return {
        type: actionTypes.DATASET_UPLOAD_SUCCESS,
        dataset: dataset,
        columns: columns,
        isDB: false,
    }
};

export const datasetRemoveUpload = () => {
    return {
        type: actionTypes.DATASET_REMOVE_UPLOAD,
        dataset: null,
        columns: null,
        isDB: null,
    }
};

export const datasetCheckUrlSuccess = (dbUrl, tables) => {
    return {
        type: actionTypes.DATASET_CHECK_URL_SUCCESS,
        dbUrl: dbUrl,
        tables: tables,
        isDB: true,
    }
};

export const datasetSelectTableSuccess = (table, columns) => {
    return {
        type: actionTypes.DATASET_SELECT_TABLE_SUCCESS,
        table: table,
        columns: columns,
    }
};

export const datasetFail = error => {
    return {
        type: actionTypes.DATASET_FAIL,
        error: error
    }
};

export const datasetUpload = (file) => {
    return dispatch => {
        dispatch(datasetStart());

        //ToDO: request POST upload and check file

        let error = false;
        if (!error) {
            let columns = ['age', 'sex', 'rank', 'survive'];
            dispatch(datasetUploadSuccess(file, columns));
        }
        else {
            dispatch(datasetFail("Upload File isn't valid"));
        }
    }
};

export const datasetCheckUrl = (url) => {
    return dispatch => {
        dispatch(datasetStart());

        //ToDO: request GET check url and get tables

        let error = false;
        if (!error) {
            let tables = ['people', 'banks', 'animals'];
            dispatch(datasetCheckUrlSuccess(url, tables));
        }
        else {
            dispatch(datasetFail("Database Url isn't valid"));
        }
    }
};

export const datasetSelectTable = (table) => {
    return dispatch => {
        dispatch(datasetStart());

        //ToDO: request GET check table and get columns

        let error = false;
        if (!error) {
            let columns = ['age', 'sex', 'rank', 'survive'];
            dispatch(datasetSelectTableSuccess(table, columns));
        }
        else {
            dispatch(datasetFail("Upload File isn't valid"));
        }
    }
};

// MODALITY actions
export const modalityChangeMode = (mode) => {
    return {
        type: actionTypes.MODALITY_CHANGE_MODE,
        mode: mode,
    }
};

export const modalitySetLabels = (labelsType, labels) => {
    return {
        type: actionTypes.MODALITY_SET_LABELS,
        labelsType: labelsType,
        labels: labels,
    }
};

export const modalitySetValidation = (validation) => {
    return {
        type: actionTypes.MODALITY_SET_VALIDATION,
        validation: validation,
    }
};

// MODEL actions
export const modelStart = () => {
    return {
        type: actionTypes.MODEL_START,
    }
};

export const modelFail = error => {
    return {
        type: actionTypes.MODEL_FAIL,
        error: error,
    }
};

export const modelGetModelsSuccess = (models) => {
    return {
        type: actionTypes.MODEL_GET_MODELS_SUCCESS,
        modelsList: models,
    }
};

export const  modelGetModels = () => {
    return dispatch => {
        dispatch(modelStart());

        //ToDO: request GET models

        let error = false;
        if (!error) {
            let models = ['gradient_boosting_classifier', 'logistic_regression', 'sdca_maximum_entropy'];
            dispatch(modelGetModelsSuccess(models));
        }
        else {
            dispatch(modelFail("NO models are available"));
        }
    }

};

export const modelGetTransformsSuccess = (transforms) => {
    return {
        type: actionTypes.MODEL_GET_TRANSFORMS_SUCCESS,
        transformsList: transforms,
    }
};

export const  modelGetTransforms = () => {
    return dispatch => {
        dispatch(modelStart());

        //ToDO: request GET transforms

        let error = false;
        if (!error) {
            let transforms = ['one_hot_encoding', 'normalization'];
            dispatch(modelGetTransformsSuccess(transforms));
        }
        else {
            dispatch(modelFail("NO transforms are available"));
        }
    }
};

export const modelSetModel = (model) => {
    return {
        type: actionTypes.MODEL_SET_MODEL,
        model: model,
    }
};

export const modelSetTransforms = (transforms) => {
    return {
        type: actionTypes.MODEL_SET_TRANSFORMS,
        transforms: transforms,
    }
};

export const modelAddTransform = (type, column) => {
    return {
        type: actionTypes.MODEL_ADD_TRANSFORM,
        transform: {
            'type': type,
            'column': column,
        }
    }
};

export const modelRemoveTransform = (index) => {
    return {
        type: actionTypes.MODEL_REMOVE_TRANSFORM,
        index: index
    }
};

export const modelUploadPipeline = (pipeline) => {
    return {
        type: actionTypes.MODEL_UPLOAD_PIPELINE,
        pipeline: pipeline,
    }
};

export const modelRemovePipeline = () => {
    return {
        type: actionTypes.MODEL_REMOVE_PIPELINE,
    }
};

export const modelChangeRunDB = (runDB) => {
    return {
        type: actionTypes.MODEL_CHANGE_RUN_DB,
        runDB: runDB,
    }
};



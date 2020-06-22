import * as actionTypes from './actionTypes';
import axios from "axios";
import {config} from "../../Constants";

// DATASET actions
export const datasetStart = () => {
    return {
        type: actionTypes.DATASET_START
    }
};

export const datasetUploadSuccess = (dataset, columns) => {
    // console.log(dataset[0].name)
    return {
        type: actionTypes.DATASET_UPLOAD_SUCCESS,
        dataset: dataset,
        columns: columns,
    }
};

export const datasetRemoveUpload = () => {
    return {
        type: actionTypes.DATASET_REMOVE_UPLOAD,
    }
};

export const datasetCheckUrlSuccess = (dbUrl, tables) => {
    return {
        type: actionTypes.DATASET_CHECK_URL_SUCCESS,
        dbUrl: dbUrl,
        tables: tables,
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

        // Upload file
        let formData = new FormData();
        formData.append("file", file);
        axios
            .post('http://' + config.url.API_URL +
                `/api/msp/document/${file.name}/`,
                formData,
                {
                    headers: {
                        'content-type': 'multipart/form-data',
                    }
                })

            .then(res => {
                // Successful upload
                // Get from columns from uploaded file
                axios
                    .get('http://' + config.url.API_URL +
                        `/api/msp/document/${file.name}/?type=columns`,
                        {
                            headers: {'content-type': 'application/json',}
                        })
                    .then(res => {
                        // Successful in getting columns
                        let columns = res.data.columns;
                        dispatch(datasetUploadSuccess([file], columns));
                    })
                    .catch(err => {
                        // Error during columns extraction
                        dispatch(datasetFail("The uploaded file isn't a dataset"));
                    });
            })
            .catch(err => {
                // Error during uploading file
                dispatch(datasetFail("The uploaded file isn't valid"));
            });
    }
};

export const datasetCheckUrl = (url) => {
    return dispatch => {
        // Check db connection url
        dispatch(datasetStart());
        axios
            .get(`http://${config.url.API_URL}/api/msp/dbms/`,
                {
                    headers: {'content-type': 'application/json'},
                    params: {'dbms_url': url}
                }
            )
            .then(res => {
                // Success in create db connection
                let tables = res.data.tables;
                dispatch(datasetCheckUrlSuccess(url, tables));
            })
            .catch(err => {
                // Error in testing db connection
                console.error(err.data);
                dispatch(datasetFail("DBMS url isn't valid"));
            });
    }
};

export const datasetSelectTable = (url, table) => {
    return dispatch => {
        dispatch(datasetStart());

        axios
            .get('http://' + config.url.API_URL + `/api/msp/dbms/`,
                {
                    headers: {'content-type': 'application/json',},
                    params: {'dbms_url': url, 'table': table}
                }
            )
            .then(res => {
                // Successful in getting columns from DBMS
                let columns = res.data.columns;
                dispatch(datasetSelectTableSuccess(table, columns));
            })
            .catch(err => {
                // Error in getting columns from DBMS
                console.error(err.data);
                dispatch(datasetFail("Error in getting columns from DBMS"));
            });
    }
};

// MODALITY actions
export const modalityStart = () => {
    return {
        type: actionTypes.MODALITY_START,
    }
};

export const modalityFail = error => {
    return {
        type: actionTypes.MODALITY_FAIL,
        error: error,
    }
};

export const modalitySetLabelsSuccess = (labelsType, labels) => {
    return {
        type: actionTypes.MODALITY_SET_LABELS_SUCCESS,
        labelsType: labelsType,
        labels: labels,
    }

};

export const modalitySetLabels = (labelsType, labels) => {
    return dispatch => {
        dispatch(modalityStart());

        switch (labelsType) {
            case ('file'):
                let formData = new FormData();
                formData.append("file", labels);
                axios
                    .post(`http://${config.url.API_URL}/api/msp/document/${labels.name}/`,
                        formData,
                        {
                            headers: {
                                'content-type': 'multipart/form-data',
                            }
                        })

                    .then(res => {
                        // Successful label file upload
                        dispatch(modalitySetLabelsSuccess(labelsType, [labels]));
                    })

                    .catch(err => {
                        // Error in label file upload
                        dispatch(modalityFail("The uploaded label file isn't valid"));
                    });
                break;
            case ('column'):
                // Column label selected
                dispatch(modalitySetLabelsSuccess(labelsType, labels));
                break;
            case ('table'):
                // Table label selected
                dispatch(modalitySetLabelsSuccess(labelsType, labels));
                break;
            case null:
                // No label selected
                dispatch(modalitySetLabelsSuccess(labelsType, labels));
                dispatch(modalitySetMetric(null));
                break;
            default:
                dispatch(modalityFail("The selected modality isn't valid"));
                break;
        }
    }
};

export const modalityChangeMode = (mode) => {
    return {
        type: actionTypes.MODALITY_CHANGE_MODE,
        mode: mode,
    }
};

export const modalitySetValidation = (validation) => {
    return {
        type: actionTypes.MODALITY_SET_VALIDATION,
        validation: validation,
    }
};

export const modalitySetMetric = (metric) => {
    return {
        type: actionTypes.MODALITY_SET_METRIC,
        metric: metric,
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

export const modelGetModels = () => {
    return dispatch => {
        dispatch(modelStart());

        axios
            .get('http://' + config.url.API_URL +
                `/api/msp/mlmanager/`,
                {'type': 'model'},
                {
                    headers: {
                        'content-type': 'application/json',
                    }
                }
            )
            .then(res => {
                console.log('get model types success', res);
                // let models = ['gradient_boosting_classifier', 'logistic_regression', 'sdca_maximum_entropy'];
                let models = res.data.model_types;
                dispatch(modelGetModelsSuccess(models));
            })
            .catch(err => {
                console.error(err.data);
                dispatch(modelFail("NO models are available"));
            });
    }
};

export const modelGetTransformsSuccess = (transforms) => {
    return {
        type: actionTypes.MODEL_GET_TRANSFORMS_SUCCESS,
        transformsList: transforms,
    }
};

export const modelGetTransforms = () => {
    return dispatch => {
        dispatch(modelStart());

        axios
            .get('http://' + config.url.API_URL +
                `/api/msp/mlmanager/`,
                {'type': 'transform'},
                {
                    headers: {
                        'content-type': 'application/json',
                    }
                }
            )
            .then(res => {
                console.log('get transform types success', res);
                // let transforms = ['one_hot_encoding', 'normalization'];
                let transforms = res.data.transform_types;
                dispatch(modelGetTransformsSuccess(transforms));
            })
            .catch(err => {
                console.error(err.data);
                dispatch(modelFail("NO transforms are available"));
            });
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

export const modelUploadPipelineSuccess = (pipeline) => {
    return {
        type: actionTypes.MODEL_UPLOAD_PIPELINE_SUCCESS,
        pipeline: pipeline,
    }
};

export const modelUploadPipeline = (pipeline) => {
    return dispatch => {
        dispatch(modelStart());

        let formData = new FormData();
        formData.append("file", pipeline);
        axios
            .post('http://' + config.url.API_URL +
                `/api/msp/document/${pipeline.name}/`,
                formData,
                {
                    headers: {
                        'content-type': 'multipart/form-data',
                    }
                })
            .then(res => {
                console.log('Successfully uploaded pipeline file', res);
                dispatch(modelUploadPipelineSuccess([pipeline]));
            })
            .catch(err => {
                console.error(err.data);
                dispatch(modelFail("The uploaded pipeline file isn't valid"));
            });
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

export const modelSetBatchNumber = (batchNumber) => {
    return {
        type: actionTypes.MODEL_SET_BATCH_NUMBER,
        batchNumber: batchNumber,
    }
};

export const modelSetBatchSize = (batchSize) => {
    return {
        type: actionTypes.MODEL_SET_BATCH_SIZE,
        batchSize: batchSize,
    }
};

export const builderSet = (scenario) => {
    return {
        type: actionTypes.BUILDER_SET,
        scenario: scenario,
    }
};

export const builderClear = () => {
    return {
        type: actionTypes.BUILDER_CLEAR,
    }
};

export const builderDeploy = (pipeline) => {
    return {
        type: actionTypes.BUILDER_DEPLOY,
        pipeline: pipeline
    }
};




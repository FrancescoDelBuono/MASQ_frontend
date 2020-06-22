import React, {Component} from 'react'
import '../App.css';
import {connect} from 'react-redux';

import * as buildActions from '../store/actions/build';
import * as navActions from '../store/actions/nav';

import {Form, Button, Select, Upload, Switch, InputNumber, Checkbox, Tag, Icon, message,} from "antd";
import axios from "axios";
import {config} from "../Constants";

let id = 0;

class ModelForm extends Component {

    state = {
        transformsInitialState: {},
    };

    componentDidMount() {
        this.props.modelGetModels();
        this.props.modelGetTransforms();
    }

    remove = k => {
        const {form} = this.props;
        const keys = form.getFieldValue('keys');
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        const {form} = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id);
        id = id + 1;
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    saveTransforms = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {keys, types, columns} = values;
                let transforms = [];
                keys.map(key => {
                    transforms.push({
                        'transform_type': types[key],
                        'transform_column': columns[key],
                    });

                    this.remove(key);
                    return key;
                });

                this.props.modelSetTransforms(transforms)
            }
        });
    };

    get_pipeline = (file) => {
        axios
            .get('http://' + config.url.API_URL +
                `/api/msp/pipeline/${file.name}/`)
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.props.modelSetModel(res.data['model']);
                this.props.modelSetTransforms(res.data['transforms']);
            })
            .catch(err => {
                console.error(err.data);
                message.error('Impossible read pipeline')
            });
    };

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;

        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };

        const formItemLayoutWithOutLabel = {
            wrapperCol: {span: 14, offset: 6},
        };

        getFieldDecorator('keys', {initialValue: []});

        const keys = getFieldValue('keys');
        const transformItems = keys.map((k, index) => (
            <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? 'Transforms' : ''}
                required={false}
                key={k}
                validateStatus={''}
            >
                {getFieldDecorator(`types[${k}]`, {
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "Please select transform or delete this field.",
                        },
                    ],
                    initialValue: (k in this.state.transformsInitialState) ? this.state.transformsInitialState[k]['type'] : '',
                })(
                    <Select
                        placeholder="Transform Type"
                        style={{width: '50%', marginRight: 8}}
                    >
                        {this.props.transformsList.map(x => {
                            return <Select.Option key={x} value={x}>{x}</Select.Option>
                        })}
                    </Select>
                )}
                {getFieldDecorator(`columns[${k}]`, {
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "Please select transform or delete this field.",
                        },
                    ],
                    initialValue: (k in this.state.transformsInitialState) ? this.state.transformsInitialState[k]['column'] : '',
                })(
                    <Select
                        placeholder="Column"
                        style={{width: '40%', marginRight: 8}}
                    >
                        {this.props.columns &&
                        this.props.columns.map(x => {
                            return <Select.Option key={x} value={x}>{x}</Select.Option>
                        })}
                    </Select>
                )}
                {keys.length > 0 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                ) : null}
            </Form.Item>
        ));

        const transformItemsReadOnly = this.props.transforms.map((k, index) => (
            <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? 'Transforms' : ''}
                key={index}
            >
                <span style={{width: '50%', marginRight: 8}}>
                    {k['transform_type']}
                </span>
                <span style={{width: '40%', marginRight: 8}}>
                    {k['transform_column']}
                </span>
            </Form.Item>
        ));

        return (
            <div style={{width: '100%', height: '100%'}}>
                <div>
                    {transformItemsReadOnly}
                </div>
                <Form {...formItemLayout}>

                    {
                        this.props.mode === 'train' &&
                        <div>
                            {transformItems}
                            <Form.Item {...formItemLayoutWithOutLabel}>
                                <Button type="dashed" onClick={this.add} style={{width: '60%'}}>
                                    <Icon type="plus"/> Add field
                                </Button>
                            </Form.Item>
                            <Form.Item {...formItemLayoutWithOutLabel}>
                                <Button type="primary" onClick={this.saveTransforms}>
                                    Save
                                </Button>
                            </Form.Item>
                        </div>
                    }

                    <Form.Item label="Model">
                        {this.props.mode === 'train' ?
                            <Select defaultValue={this.props.model}
                                    placeholder="Please select the model"
                                    style={{width: '60%'}}
                                    onChange={
                                        (value) =>
                                            this.props.modelSetModel(value)
                                    }
                            >
                                {this.props.modelsList.map(x => {
                                    return <Select.Option key={x} value={x}>{x}</Select.Option>
                                })}
                            </Select>
                            :
                            <span>{this.props.model ? this.props.model : "no selected model"}</span>
                        }
                    </Form.Item>

                    {
                        this.props.mode === 'test' &&
                        <Form.Item label="Upload Fitted Model">
                            <Upload fileList={this.props.pipeline}
                                    onRemove={() => {
                                        this.props.modelRemovePipeline();
                                        this.props.modelSetModel('');
                                        this.props.modelSetTransforms([]);
                                    }}
                                    beforeUpload={file => {
                                        this.props.modelUploadPipeline(file);
                                        this.get_pipeline(file);
                                        return false;
                                    }}>
                                <Button>
                                    <Icon type="upload"/> Model
                                </Button>
                            </Upload>
                        </Form.Item>
                    }

                    {
                        this.props.mode === 'test' &&
                        this.props.isDB &&
                        !this.props.isSimulation &&
                        <Form.Item label="Run on">
                            <Switch
                                checkedChildren={<Icon type="check"/>}
                                unCheckedChildren={<Icon type="close"/>}
                                onChange={(val) => this.props.modelChangeRunDB(val)}
                                defaultChecked={this.props.runDB}
                            />
                            <span style={{marginLeft: 15}}>
                                {this.props.runDB ?
                                    <Tag color='geekblue'>QUERY ON DBMS</Tag>
                                    :
                                    <Tag color='green'>ML LIBRARY</Tag>
                                }
                            </span>
                        </Form.Item>
                    }

                    {
                        this.props.mode === 'test' &&
                        this.props.isDB &&
                        <div>
                            <Form.Item label='Simulation'>
                                <Checkbox
                                    onChange={(e) => this.props.setIsSimulation(e.target.checked)}
                                    checked={this.props.isSimulation}
                                />
                                {this.props.isSimulation &&
                                <span style={{marginLeft: 15}}>Test between Query on DBMS and ML Library</span>}
                            </Form.Item>
                            {
                                this.props.isSimulation &&
                                <div>
                                    <Form.Item {...formItemLayoutWithOutLabel}>
                                        <InputNumber min={1} value={this.props.batchSize}
                                                     onChange={(e) =>
                                                         this.props.modelSetBatchSize(e)}/>
                                        <span className="ant-form-text"> Batch Size</span>

                                        <InputNumber min={1} value={this.props.batchNumber}
                                                     style={{marginLeft: 15}}
                                                     onChange={(e) =>
                                                         this.props.modelSetBatchNumber(e)}/>
                                        <span className="ant-form-text"> Batch Number</span>
                                    </Form.Item>
                                </div>
                            }
                        </div>
                    }

                </Form>
            </div>

        );
    }
}

const WrappedModelForm = Form.create({name: 'model_form'})(ModelForm);

const mapStateToProps = state => {
    return {
        isDB: state.build.isDB,
        dbUrl: state.build.dbUrl,
        table: state.build.table,
        columns: state.build.columns,

        mode: state.build.mode,
        labelsType: state.build.labelsType,
        labels: state.build.labels,


        modelsList: state.build.modelsList,
        transformsList: state.build.transformsList,
        model: state.build.model,
        transforms: state.build.transforms,
        pipeline: state.build.pipeline,
        runDB: state.build.runDB,

        batchNumber: state.build.batchNumber,
        batchSize: state.build.batchSize,

        isSimulation: state.nav.isSimulation,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        modelGetModels: () => dispatch(buildActions.modelGetModels()),
        modelGetTransforms: () => dispatch(buildActions.modelGetTransforms()),
        modelSetModel: (model) => dispatch(buildActions.modelSetModel(model)),
        modelSetTransforms: (transforms) => dispatch(buildActions.modelSetTransforms(transforms)),
        modelUploadPipeline: (pipeline) => dispatch(buildActions.modelUploadPipeline(pipeline)),
        modelRemovePipeline: () => dispatch(buildActions.modelRemovePipeline()),
        modelChangeRunDB: (runDB) => dispatch(buildActions.modelChangeRunDB(runDB)),
        modelSetBatchNumber: (batchNumber) => dispatch(buildActions.modelSetBatchNumber(batchNumber)),
        modelSetBatchSize: (batchSize) => dispatch(buildActions.modelSetBatchSize(batchSize)),

        setIsSimulation: (isSimulation) => dispatch(navActions.setIsSimulation(isSimulation)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WrappedModelForm);
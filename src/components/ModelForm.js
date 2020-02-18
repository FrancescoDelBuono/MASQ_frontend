import React, {Component} from 'react'
import '../App.css';
import {connect} from 'react-redux';

import * as buildActions from '../store/actions/build';
import {Form, Button, Select, Upload, Switch, InputNumber, Tooltip, Icon,} from "antd";

let id = 0;

class ModelForm extends Component {

    state = {
        transformsInitialState: {}
    };

    componentDidMount() {
        this.props.modelGetModels();
        this.props.modelGetTransforms();

        if (this.props.transforms) {
            let res = {};
            this.props.transforms.forEach(item => {
                console.log(item);
                res[id] = item;
                this.add();
            });
            this.setState({
                transformsInitialState: res
            });
        }
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
                const typesList = keys.map(key => types[key]);
                const columnsList = keys.map(key => columns[key]);
                let transforms = [];
                for (let i = 0; i < typesList.length; i++) {
                    transforms.push({
                        'transform_type': typesList[i],
                        'transform_column': columnsList[i],
                    })
                }
                this.props.modelSetTransforms(transforms)
            }
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
                    // validateTrigger: ['onChange', 'onBlur'],
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
                    // validateTrigger: ['onChange', 'onBlur'],
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

        return (
            <div style={{width: '100%', height: '100%'}}>
                <Form {...formItemLayout}>

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

                    <Form.Item label="Model">
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
                    </Form.Item>

                    {
                        this.props.mode === 'test' &&
                        <Form.Item label="Upload Fitted Model">
                            <Upload fileList={this.props.pipeline}
                                    onRemove={() => {
                                        this.props.modelRemovePipeline();
                                    }}
                                    beforeUpload={file => {
                                        this.props.modelUploadPipeline(file);
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
                        this.props.isDB === true &&
                        <Form.Item label="Run On DB">
                            <Switch
                                checkedChildren={<Icon type="check"/>}
                                unCheckedChildren={<Icon type="close"/>}
                                onChange={(val) => this.props.modelChangeRunDB(val)}
                                defaultChecked={this.props.runDB}
                            />
                        </Form.Item>
                    }

                    {
                        this.props.mode === 'test' &&
                        <div>
                            <Form.Item label="Fast Test">
                                {getFieldDecorator('batch_size', {initialValue: 1000})(<InputNumber min={1}/>)}
                                <span className="ant-form-text"> Batch Size</span>
                                {getFieldDecorator('batch_number', {initialValue: 5})(<InputNumber min={1}/>)}
                                <span className="ant-form-text"> Batch Number</span>
                            </Form.Item>
                            <Form.Item {...formItemLayoutWithOutLabel}>
                                <Tooltip placement="right"
                                         title="Test between Query on DBMS and ML Library">
                                    <Button
                                        icon="rocket"
                                        onClick={() => {
                                            const {form} = this.props;
                                            const batch_size = form.getFieldValue('batch_size');
                                            const batch_number = form.getFieldValue('batch_number');

                                            console.log('perform fast test with batch size ',
                                                batch_size, ' and batch number ', batch_number);
                                        }}
                                        shape="circle"
                                        size="large"
                                    />
                                </Tooltip>
                            </Form.Item>
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
        columns: state.build.columns,
        isDB: state.build.isDB,
        mode: state.build.mode,

        modelsList: state.build.modelsList,
        transformsList: state.build.transformsList,
        model: state.build.model,
        transforms: state.build.transforms,
        pipeline: state.build.pipeline,
        runDB: state.build.runDB,
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WrappedModelForm);
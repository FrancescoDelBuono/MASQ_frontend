import React, {Component} from 'react'
import {connect} from 'react-redux';

import * as buildActions from '../store/actions/build';

import {
    Form,
    InputNumber,
    Upload,
    Radio,
    Button,
    Slider,
    Select,
    Row, Col,
    Icon,
} from 'antd';
import axios from "axios";
import {config} from "../Constants";


class ModalityForm extends Component {

    state = {
        metricsList: []
    };

    componentDidMount() {
        this.props.form.validateFields();
        this.getMetricsTypes()
    }

    getMetricsTypes = () => {
        axios
            .get('http://' + config.url.API_URL +
                `/api/msp/mlmanager/`,
                {'type': 'metric'},
                {
                    headers: {
                        'content-type': 'application/json',
                    }
                }
            )
            .then(res => {
                console.log('get metric types success', res);
                // let transforms = ['one_hot_encoding', 'normalization'];
                this.setState({metricsList: res.data.metric_types});
            })
            .catch(err => {
                console.error(err.data);
            });

    };

    beforeLabelUpload = file => {
        console.log('Get Label file:', file);
        let labels_type = this.props.form.getFieldValue('labels_type');
        this.props.modalitySetLabels(labels_type, file);
        return false;
    };

    onChangeLabelsType = (event) => {
        console.log(event)
        console.log(typeof (event))
        console.log(null)
        console.log(event === null)
        if (event === null) {
            console.log('set null')
            this.props.modalitySetLabels(null, null)
        }
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


        return (
            <div style={{
                width: '100%',
                height: '100%',
                // border: 'solid'
            }}>
                <Form {...formItemLayout}>
                    <Form.Item label="Mode: ">
                        <Radio.Group
                            // size="large"
                            defaultValue={this.props.mode}
                            style={{width: '100%'}}
                            onChange={(e) => this.props.modalityChangeMode(e.target.value)}>
                            <Radio.Button value="test"
                                          style={{width: '30%', textAlign: 'center'}}>Test</Radio.Button>
                            <Radio.Button value="train"
                                          style={{width: '30%', textAlign: 'center'}}>Train</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    {
                        this.props.mode === 'test' &&
                        <Form.Item {...formItemLayoutWithOutLabel}>
                            <span> Optional Labels</span>
                        </Form.Item>

                    }

                    <Form.Item label="Labels Type">
                        {getFieldDecorator('labels_type', {
                            initialValue: this.props.labelsType,
                            onChange: this.onChangeLabelsType,
                        })(
                            <Select placeholder="Please select a modality" style={{width: 160}}>
                                {this.props.mode === 'test' &&
                                <Select.Option value={null}>no labels</Select.Option>}

                                <Select.Option value="file">file</Select.Option>

                                {this.props.columns &&
                                <Select.Option value="column">column</Select.Option>}

                                {this.props.isDB &&
                                <Select.Option value="table">table</Select.Option>}
                            </Select>
                        )}
                    </Form.Item>

                    {
                        getFieldValue('labels_type') === 'file' &&
                        <Form.Item label="Upload Labels">
                            <Upload fileList={this.props.labelsType === 'file' ? this.props.labels : []}
                                    onRemove={(e) => {
                                        return false
                                    }}
                                    beforeUpload={this.beforeLabelUpload}
                            >
                                <Button>
                                    <Icon type="upload"/> Select File
                                </Button>
                            </Upload>
                        </Form.Item>
                    }

                    {
                        getFieldValue('labels_type') === 'column' &&
                        <Form.Item label="Column">
                            <Select defaultValue={this.props.labelsType === 'column' ? this.props.labels : ""}
                                    placeholder="Please select the column"
                                    style={{width: 160}}
                                    onChange={
                                        (value) =>
                                            this.props.modalitySetLabels(getFieldValue('labels_type'), value)
                                    }
                            >
                                {this.props.columns.map(x => {
                                    return <Select.Option key={x} value={x}>{x}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    }

                    {
                        getFieldValue('labels_type') === 'table' &&
                        <Form.Item label="Table">
                            <Select defaultValue={this.props.labelsType === 'table' ? this.props.labels : ""}
                                    placeholder="Please select the table"
                                    style={{width: 160}}
                                    onChange={
                                        (value) =>
                                            this.props.modalitySetLabels(getFieldValue('labels_type'), value)
                                    }
                            >
                                {this.props.tables.map(x => {
                                    return <Select.Option key={x} value={x}>{x}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    }

                    {
                        this.props.mode === 'train' &&
                        <Form.Item label="Validation %: ">
                            <Row>
                                <Col span={12}>
                                    <Slider
                                        min={0}
                                        max={100}
                                        onChange={(value) => {
                                            this.props.modalitySetValidation(value)
                                        }}
                                        value={typeof this.props.validation === 'number' ?
                                            this.props.validation : 0}
                                    />
                                </Col>
                                <Col span={4}>
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        style={{marginLeft: 16}}
                                        value={this.props.validation}
                                        formatter={value => `${value}%`}
                                        parser={value => value.replace('%', '')}
                                        onChange={(value) => {
                                            this.props.modalitySetValidation(value)
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Form.Item>
                    }

                    <Form.Item label="Metric Types">
                        <Select placeholder="Select an evaluation metrics"
                                // defaultValue={this.props.metric}
                                onChange={(event) => this.props.modalitySetMetric(event)}
                                style={{width: 160}}
                                value={this.props.metric}
                        >
                            {this.state.metricsList.map(x => {
                                return <Select.Option key={x} value={x}>{x}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>

                </Form>
            </div>
        );
    }
}

const WrappedModalityForm = Form.create({name: 'modality_form'})(ModalityForm);

const mapStateToProps = state => {
    return {
        mode: state.build.mode,
        validation: state.build.validation,
        metric: state.build.metric,
        labelsType: state.build.labelsType,
        labels: state.build.labels,

        columns: state.build.columns,
        tables: state.build.tables,
        isDB: state.build.isDB,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        modalityChangeMode: (mode) => dispatch(buildActions.modalityChangeMode(mode)),
        modalitySetLabels: (labelsType, labels) => dispatch(buildActions.modalitySetLabels(labelsType, labels)),
        modalitySetValidation: (value) => dispatch(buildActions.modalitySetValidation(value)),
        modalitySetMetric: (metric) => dispatch(buildActions.modalitySetMetric(metric)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WrappedModalityForm);
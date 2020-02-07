import React, {Component} from 'react'
import {connect} from 'react-redux';

import * as buildActions from '../store/actions/build';

import {
    Form,
    Input,
    Upload,
    Button,
    Select,
    Row, Col,
    Alert,
    Spin,
    Icon,
    message
} from 'antd';

function hasErrors(fieldsError) {
    return false;
    // return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class DatasetForm extends Component {

    componentDidMount() {
        this.props.form.validateFields();
    }

    handleUpload = () => {
        const {fileList} = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files[]', file);
        });

        this.setState({
            uploading: true,
        });

        // You can use any AJAX library you like
        this.setState({
            fileList: [],
            uploading: false,
        });
        message.success('upload successfully.');
    };

    onRemove = file => {
        console.log('Remove file:', file)
        this.props.datasetRemoveUpload();
        // this.setState(state => {
        //     const index = state.fileList.indexOf(file);
        //     const newFileList = state.fileList.slice();
        //     newFileList.splice(index, 1);
        //     return {
        //         fileList: newFileList,
        //     };
        // });
    };

    beforeUpload = file => {
        // console.log('Get file:', file)
        // this.setState(state => ({
        //     fileList: [file],
        // }));
        console.log('Get file:', file);
        this.props.datasetUpload([file]);
        return false;
    };

    uploadFileForm = e => {
        console.log('Upload file event:', e);
        let fileList = [...e.fileList];
        if (fileList.length === 0) {
            return null;
        }
        fileList = fileList.slice(-1);
        return fileList;
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                if (values['uploaded_file']) {
                    this.props.datasetUpload(values['uploaded_file'])
                } else if (values['select']) {
                    this.props.datasetSelectTable(values['select'])
                }
            }
        });
    };

    checkDBConnection = e => {
        let dbUrl = this.props.form.getFieldValue('db_url');
        console.log('Check connection:', dbUrl);
        if (dbUrl) {
            this.props.datasetCheckUrl(dbUrl)
        }
    };

    render() {
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (
                <Alert
                    message="Error"
                    description={this.props.error}
                    type="error"
                    showIcon
                    style={{
                        marginBottom: '24px'
                    }}
                />)
        }

        return (
            <div style={{
                width: '100%',
                height: '100%',
                // border: 'solid'
            }}>
                {errorMessage}

                {
                    this.props.loading ?
                        <div style={{
                            textAlign: 'center'
                        }}>
                            <Spin indicator={
                                <Icon type="loading" style={{fontSize: 64}} spin/>
                            }/>
                        </div>
                        :

                        <Form layout="vertical">
                            <Row type="flex" justify="center" align="top">
                                <Col span={9}>
                                    <Form.Item label="Option 1: Upload Dataset">
                                        {/*{getFieldDecorator('uploaded_file', {*/}
                                        {/*    valuePropName: 'fileList',*/}
                                        {/*    getValueFromEvent: this.uploadFileForm,*/}
                                        {/*    initialValue: this.props.dataset,*/}
                                        {/*})(*/}
                                        {/*    <Upload beforeUpload={this.beforeUpload}>*/}
                                        {/*        <Button>*/}
                                        {/*            <Icon type="upload"/> Select File*/}
                                        {/*        </Button>*/}
                                        {/*    </Upload>,*/}
                                        {/*)}*/}
                                        <Upload fileList={this.props.dataset} onRemove={this.onRemove}
                                                beforeUpload={this.beforeUpload}>
                                            <Button>
                                                <Icon type="upload"/> Select File
                                            </Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>

                                <Col span={9}>
                                    <Row gutter={8} type="flex" align="middle">
                                        <Col span={20}>

                                            <Form.Item label="Option 2: Insert DB url"
                                                       wrapperCol={{span: 24}}>
                                                {getFieldDecorator('db_url', {
                                                    initialValue: this.props.dbUrl,
                                                })(
                                                    <Input placeholder='database url'/>
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <Button shape="circle" icon="sync"
                                                    onClick={this.checkDBConnection}/>
                                        </Col>
                                    </Row>


                                    {
                                        this.props.isDB &&
                                        <Form.Item label="Select Table:" hasFeedback>
                                            <Select defaultValue={this.props.table}
                                                    placeholder="Please select the table"
                                                    onChange={
                                                        (value) =>
                                                            this.props.datasetSelectTable(value)}
                                            >
                                                {this.props.tables.map(x => {
                                                    return <Select.Option key={x} value={x}>{x}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    }

                                </Col>
                            </Row>
                        </Form>
                }
            </div>
        );
    }
}

const WrappedDatasetForm = Form.create({name: 'dataset_form'})(DatasetForm);

const mapStateToProps = state => {
    return {
        isDB: state.build.isDB,
        dataset: state.build.dataset,
        dbUrl: state.build.dbUrl,
        tables: state.build.tables,
        table: state.build.table,
        columns: state.build.columns,

        error: state.build.error,
        loading: state.build.loading,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        datasetUpload: (file) => dispatch(buildActions.datasetUpload(file)),
        datasetRemoveUpload: () => dispatch(buildActions.datasetRemoveUpload()),
        datasetCheckUrl: (url) => dispatch(buildActions.datasetCheckUrl(url)),
        datasetSelectTable: (table) => dispatch(buildActions.datasetSelectTable(table)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDatasetForm);
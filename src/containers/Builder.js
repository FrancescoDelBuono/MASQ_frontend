import React, {Component} from 'react'
import {connect} from 'react-redux';

import * as itemsActions from '../store/actions/items';
import * as navActions from "../store/actions/nav";

import {Layout, Row, Col, Steps, Button, Divider, message, Modal,} from 'antd';

import DatasetForm from "../components/DatasetForm";
import ModalityForm from "../components/ModalityForm";
import ModelForm from "../components/ModelForm";
import axios from "axios";
import {config} from "../Constants";

const {Content} = Layout;
const {Step} = Steps;


const steps = [
    {
        title: 'Dataset',
        content: 'Dataset Form',
    },
    {
        title: 'Modality',
        content: 'Modality Form',
    },
    {
        title: 'Model',
        content: 'Model Form',
    },
];


class Builder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            ml_results: {},
            dbms_results: {},
        };
    }

    onChange = current => {
        console.log('onChange:', current);
        this.props.setStep(current);
    };

    next() {
        const current = this.props.currentStep + 1;
        this.props.setStep(current);
    }

    prev() {
        const current = this.props.currentStep - 1;
        this.props.setStep(current);
    }

    executeBuilder() {

        let dataset = this.props.dataset ? this.props.dataset[0].name : null;
        let labels = this.props.labels;
        if (this.props.labelsType === 'file')
            labels = labels[0].name;

        let pipeline = this.props.pipeline ? this.props.pipeline[0].name : null;

        axios
            .post('http://' + config.url.API_URL +
                `/api/msp/scenario/`,
                {
                    is_db: this.props.isDB,
                    dataset: dataset,
                    db_url: this.props.dbUrl,
                    table: this.props.table,

                    mode: this.props.mode,
                    validation: this.props.validation,
                    metric: this.props.metric,
                    labels_type: this.props.labelsType,
                    labels: labels,

                    model: this.props.model,
                    transforms: this.props.transforms,
                    pipeline: pipeline,
                    run_db: this.props.runDB,
                }
                ,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

            .then(res => {
                console.log('Upload dataset', res.data);
                message.success('Processing complete!');
                this.props.openPopup('result', res.data['scenario_id'])
            })
            .catch(err => {
                console.error(err.data);
                message.error('WRONG! ERROR!')
            });
    }

    executeSimulation = () => {
        console.log('perform simulation with batch size ',
            this.props.batchSize, ' and batch number ', this.props.batchNumber);

        let labels = this.props.labelsType === 'column' ? this.props.labels : null;
        let pipeline = this.props.pipeline ? this.props.pipeline[0].name : null;

        axios
            .post('http://' + config.url.API_URL +
                `/api/msp/scenario/fast/`,
                {
                    db_url: this.props.dbUrl,
                    table: this.props.table,
                    model: this.props.model,
                    transforms: this.props.transforms,
                    pipeline: pipeline,
                    labels: labels,
                    batch_number: this.props.batchNumber,
                    batch_size: this.props.batchSize,
                }
                ,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

            .then(res => {
                console.log('Upload dataset', res.data);
                message.success('Processing complete!');
                this.setState({
                    ml_results: res.data['ml_results'],
                    dbms_results: res.data['dbms_results'],
                });
                this.showModal()
            })
            .catch(err => {
                console.error(err);
                message.error('WRONG! ERROR!');
            });
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <Content style={{margin: '24px 16px 0'}}>
                <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                    <Steps current={this.props.currentStep} onChange={this.onChange} status='process'>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title}/>
                        ))}
                    </Steps>
                    <Divider/>
                    <div style={{
                        margin: '16px',
                        paddingTop: '30px',
                        minHeight: '270px',
                        // border: 'solid',
                        // borderColor: 'red',
                        // textAlign: 'center',
                    }}>
                        {steps[this.props.currentStep].title === 'Dataset' &&
                        <DatasetForm/>
                        }
                        {steps[this.props.currentStep].title === 'Modality' &&
                        <ModalityForm/>
                        }
                        {steps[this.props.currentStep].title === 'Model' &&
                        <ModelForm/>
                        }
                    </div>
                    <div style={{marginTop: '24px'}}>
                        <Row type="flex" justify="space-between" align="middle">
                            <Col span={4} style={{textAlign: 'left'}}>
                                {this.props.currentStep > 0 && (
                                    <Button type="normal" shape="circle" size="large" icon={"left"}
                                            onClick={() => this.prev()}/>
                                )}
                            </Col>
                            <Col span={4} offset={16} style={{textAlign: 'right'}}>
                                {this.props.currentStep === steps.length - 1 &&
                                (this.props.isSimulation ?
                                        <Button onClick={() => {
                                            this.executeSimulation()
                                        }}>
                                            Simulation
                                        </Button>
                                        :
                                        <Button type="primary" onClick={() => {
                                            this.executeBuilder()
                                        }}>
                                            Execute
                                        </Button>
                                )}
                                {this.props.currentStep < steps.length - 1 && (
                                    <Button type="primary" shape="circle" size="large" icon={"right"}
                                            onClick={() => this.next()}/>
                                )}
                            </Col>
                        </Row>
                    </div>
                </div>
                <Modal
                    title="ML Library vs Query on DBMS"
                    visible={this.state.visible}
                    onCancel={this.handleOk}
                    footer={null}
                >
                    <h2>Execution Time Estimation</h2>

                    <p>ML library: {this.state.ml_results['execution_time']} s</p>
                    <p>DBMS query: {this.state.dbms_results['execution_time']} s</p>
                </Modal>

            </Content>
        );
    }
}

const mapStateToProps = state => {
    return {
        isDB: state.build.isDB,
        dataset: state.build.dataset,
        dbUrl: state.build.dbUrl,
        tables: state.build.tables,
        table: state.build.table,
        columns: state.build.columns,

        mode: state.build.mode,
        validation: state.build.validation,
        metric: state.build.metric,
        labelsType: state.build.labelsType,
        labels: state.build.labels,

        model: state.build.model,
        transforms: state.build.transforms,
        pipeline: state.build.pipeline,
        runDB: state.build.runDB,

        batchNumber: state.build.batchNumber,
        batchSize: state.build.batchSize,

        isSimulation: state.nav.isSimulation,

        currentStep: state.nav.currentStep
    }
};

const mapDispatchToProps = dispatch => {
    return {
        selectItem: (item) => dispatch(itemsActions.selectItem(item)),
        openPopup: (name, id) => dispatch(navActions.openPopup(name, id)),
        setStep: (step) => dispatch(navActions.setStep(step)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Builder);
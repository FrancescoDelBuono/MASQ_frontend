import React from "react";
import {connect} from 'react-redux';

import {Modal, Collapse, Button, message} from "antd";

import * as buildActions from '../store/actions/build';
import * as navActions from "../store/actions/nav";

import axios from "axios";
import {config} from "../Constants";

const {Panel} = Collapse;

class PopupModal extends React.Component {

    state = {
        executionTime: null,
        throughput: null,
        score: null,
        fileResult: null,
        query: null,
    };

    componentDidMount() {
        console.log('mount' + this.props.namePopup);
        if (this.props.namePopup === 'result')
            this.get_result_scenario(this.props.data)
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('update' + this.props.namePopup);
        if (this.props.namePopup === 'result' && prevProps.data !== this.props.data)
            this.get_result_scenario(this.props.data)
    }

    get_result_scenario(id) {
        axios
            .get('http://' + config.url.API_URL +
                `/api/msp/scenario/result/?id=${id}`)
            .then(res => {
                console.log(res);
                this.setState({
                    executionTime: res.data['execution_time'],
                    throughput: res.data['throughput'],
                    score: res.data['score'],
                    fileResult: res.data['file_result'],
                    query: res.data['query'],
                })

            })
            .catch(err => {
                console.error(err.data);
                this.props.closePopup();
            });
    }

    download_file = (file_name) => {
        axios
            .get('http://' + config.url.API_URL + `/api/msp/document/${file_name}/`)
            .then(res => {
                console.log(res);
                let element = document.createElement('a');
                element.setAttribute('href', 'data:application/octet-stream,' + encodeURIComponent(res.data));
                element.setAttribute('download', file_name);

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);


            })
            .catch(err => {
                console.error(err.data);
                message.error('Impossible download file');
            });
    };

    deployScenario = (file_name) => {
        axios
            .get('http://' + config.url.API_URL + `/api/msp/document/${file_name}/`)
            .then(res => {
                console.log(res);
                let s = res.data;
                let blob = new Blob([JSON.stringify(s, null, 2)],
                    {type: 'application/json'});
                let file = new File([blob], file_name)
                file['uid'] = 'rc-123456789';
                this.props.builderDeploy([file]);
                this.props.setStep(0);
                this.props.closePopup();
            })
            .catch(err => {
                console.error(err.data);
                message.error('Impossible deploy scenario');
            });
    };

    render() {
        let footer = [
            <Button key="back" onClick={this.props.closePopup}>
                Close
            </Button>,
            <Button key="submit" type="danger" onClick={() => {
                this.props.builderClear();
                this.props.setStep(0);
                this.props.closePopup();
            }}>
                Clear
            </Button>,
        ];

        if (this.props.mode === 'train')
            footer.push(
                <Button key="submit" type="primary"
                        onClick={() => this.deployScenario(this.state.fileResult)}>
                    Deploy
                </Button>
            );

        return (
            <Modal
                centered
                visible={this.props.showPopup}
                onCancel={this.props.closePopup}
                width={'80%'}
                bodyStyle={{
                    minHeight: '640px'
                }}
                footer={footer}
            >
                <div>
                    <h1>Results {this.props.data}</h1>
                    <Button onClick={() => this.download_file(this.state.fileResult)} type="link">
                        {this.state.fileResult}
                    </Button>
                    <Collapse defaultActiveKey={['1']}>
                        <Panel header="Measures" key="1">
                            <p>Execution Time: {this.state.executionTime}</p>
                            <p>Throughput: {this.state.throughput}</p>
                            {this.state.score && <p>Score: {this.state.score}</p>}
                        </Panel>
                        {
                            this.state.query &&
                            <Panel header="Query" key="2">
                                <p>{this.state.query}</p>
                            </Panel>
                        }
                    </Collapse>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        showPopup: state.nav.showPopup,
        namePopup: state.nav.namePopup,
        data: state.nav.data,

        mode: state.build.mode,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        closePopup: () => dispatch(navActions.closePopup()),
        setStep: (step) => dispatch(navActions.setStep(step)),

        builderClear: () => dispatch(buildActions.builderClear()),
        builderDeploy: (pipeline) => dispatch(buildActions.builderDeploy(pipeline)),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PopupModal);
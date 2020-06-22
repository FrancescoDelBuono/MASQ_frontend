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
        console.log('ExecutionPopup: componentDidMount ', this.props.namePopup);
        if (this.props.namePopup === 'result' || this.props.namePopup === 'detail')
            // Get scenario detail
            this.get_result_scenario(this.props.data)
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('ExecutionPopup: componentDidUpdate ', this.props.namePopup);
        if ((this.props.namePopup === 'result' || this.props.namePopup === 'detail') && prevProps.data !== this.props.data)
            // Get scenario detail if data id is changed
            this.get_result_scenario(this.props.data)
    }

    get_result_scenario(id) {
        // Get from server scenario id detail
        console.log('ExecutionPopup: get result scenario ', id);
        axios
            .get('http://' + config.url.API_URL +
                `/api/msp/scenario/result/?id=${id}`)
            .then(res => {
                // console.log(res);
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

    download_file(file_name) {
        // Get file from server and download it
        console.log('ExecutionPopup: download file ', file_name);
        axios
            .get('http://' + config.url.API_URL + `/api/msp/document/${file_name}/`)
            .then(res => {
                // res contains the file to download
                let element = document.createElement('a');
                element.setAttribute('href', 'data:application/octet-stream,' + encodeURIComponent(res.data));
                element.setAttribute('download', file_name);

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);

            })
            .catch(err => {
                // error in getting file
                console.error(err.data);
                message.error('Impossible to download file');
            });
    };

    deployScenario(fileName) {
        // Get trained pipeline from server and deploy for test step
        console.log('ExecutionPopup: deploy scenario ', fileName);
        axios
            .get('http://' + config.url.API_URL + `/api/msp/document/${fileName}/`)
            .then(res => {
                // res contain the trained pipeline file
                let s = res.data;
                let blob = new Blob([JSON.stringify(s, null, 2)],
                    {type: 'application/json'});
                let file = new File([blob], fileName);
                file['uid'] = 'rc-123456789';

                // deploy on test step
                this.props.builderDeploy([file]);
                // return in pipeline step 0
                this.props.setStep(0);
                // close popup
                this.props.closePopup();
            })
            .catch(err => {
                // error in getting file
                console.error(err.data);
                message.error('Impossible deploy scenario');
            });
    };

    render() {
        // Create footer for Popup
        let footer = [
            <Button key="back" onClick={this.props.closePopup}>
                Close
            </Button>,
        ];

        if (this.props.namePopup === 'result') {
            footer.push(
                <Button key="clear" type="danger" onClick={() => {
                    this.props.builderClear();
                    this.props.setStep(0);
                    this.props.closePopup();
                }}>
                    Clear
                </Button>
            );
        }

        if (this.props.mode === 'train' && this.props.namePopup === 'result')
            footer.push(
                <Button key="deploy" type="primary"
                        onClick={() => this.deployScenario(this.state.fileResult)}>
                    Deploy
                </Button>
            );

        return (
            <Modal
                centered
                visible={this.props.showPopup}
                onCancel={this.props.closePopup}
                width={'70%'}
                bodyStyle={{
                    minHeight: '60%'
                }}
                footer={footer}
            >
                {/*<div>*/}
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
                {/*</div>*/}
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
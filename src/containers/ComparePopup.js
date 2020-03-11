import React from "react";
import {connect} from 'react-redux';

import {Table, Modal, Badge, Tag} from "antd";

import * as navActions from "../store/actions/nav";
import axios from "axios";
import {config} from "../Constants";

class ComparePopupModal extends React.Component {

    state = {
        scenarios: {},
        columns: [{
            title: 'index',
            dataIndex: 'index',
            key: 'index',
        }],
        dataSource: [
            {
                key: '1',
                index: 'data',
            },
            {
                key: '2',
                index: 'table',
            },
            {
                key: '3',
                index: 'mode',
            },
            {
                key: '4',
                index: 'model',
            },
            {
                key: '5',
                index: 'transforms',
            },
            {
                key: '6',
                index: 'run db',
            },
            {
                key: '7',
                index: 'execution time',
            },
            {
                key: '8',
                index: 'throughput',
            },
            {
                key: '9',
                index: 'score',
            },
        ],
    };

    componentDidMount() {
        console.log('componentDidMount ComparePopup: ' + this.props.idScenarios.join(', '));
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('componentDidUpdate ComparePopup');
        console.log(this.props.idScenarios);
        if (prevProps.idScenarios !== this.props.idScenarios) {
            console.log('update compare scenarios list');
            this.setState({scenarios: {}});
            this.props.idScenarios.forEach(x => {
                console.log('get complete scenario: ' + x);
                this.get_complete_scenario(x);
            })
        }
    }

    valueTable = text => {
        if (text === 'DBMS')
            return (<Badge status="processing" text="DBMS"/>);
        else if (text === 'Dataset')
            return (<Badge status="default" text="File"/>);
        else if (text === 'test')
            return (<Tag color='geekblue'>{text.toUpperCase()}</Tag>);
        else if (text === 'train')
            return (<Tag color='green'>{text.toUpperCase()}</Tag>);
        else if (text === 'QUERY')
            return (<Badge status="processing" text="Query"/>);
        else if (text === 'ML')
            return (<Badge status="default" text="ML Library"/>);
        else
            return (<span>{text}</span>);
    };

    get_complete_scenario(id) {
        axios
            .get('http://' + config.url.API_URL +
                `/api/msp/scenario/complete/?id=${id}`)
            .then(res => {
                console.log(res);
                let scenarios = this.state.scenarios;
                scenarios[id] = res.data;

                let columns = this.state.columns;
                let dataSource = this.state.dataSource;

                columns.push({
                    title: `Scenario ${id}`,
                    dataIndex: id,
                    key: id,
                    render: this.valueTable,
                });

                dataSource[0][id] = res.data.is_db ? 'DBMS' : 'Dataset';
                dataSource[1][id] = res.data.is_db ? res.data.table  : res.data.dataset;
                dataSource[2][id] = res.data.mode;
                dataSource[3][id] = res.data.model;
                dataSource[4][id] = res.data.transforms ? res.data.transforms.length : 0;
                dataSource[5][id] = res.data.run_db ? 'QUERY' : 'ML';
                dataSource[6][id] = res.data.throughput;
                dataSource[7][id] = res.data.execution_time;
                dataSource[8][id] = res.data.score;

                this.setState({scenarios: scenarios});
            })
            .catch(err => {
                console.error(err.data);
                this.props.closePopup();
            });
    }


    render() {

        // let scenarioComponents = Object.entries(this.state.scenarios).map(([key, value]) => (
        //     <div style={{
        //         margin: 15
        //     }}>
        //         <h3>Scenario {key}</h3>
        //         <pre>
        //             {
        //                 value.is_db ?
        //                     <Badge status="processing" text="DBMS"/>
        //                     :
        //                     <Badge status="warning" text="Dataset"/>
        //             }{"\n"}
        //             {
        //                 value.is_db ?
        //                     value.table
        //                     :
        //                     value.dataset
        //             }{"\n"}
        //             {value.mode}{"\n"}
        //             {value.labels_type ?
        //                 value.labels_type
        //                 :
        //                 'NO Labels'
        //             }{"\n"}
        //             {value.model}{"\n"}
        //             {value.transforms ? value.transforms.length : 0} transforms{"\n"}
        //             {
        //                 value.run_db ?
        //                     <Badge status="processing" text="query DBMS"/>
        //                     :
        //                     <Badge status="default" text="ML Library"/>
        //             }{"\n"}
        //         </pre>
        //     </div>
        // ));
        //
        // let executionTimeComponents = Object.entries(this.state.scenarios).map(([key, value]) => (
        //     <div style={{margin: 15}}>
        //         <pre>
        //             Scenario {key}: {value.execution_time} sec{"\n"}
        //         </pre>
        //     </div>
        // ));
        //
        // let throughputComponents = Object.entries(this.state.scenarios).map(([key, value]) => (
        //     <div style={{margin: 15}}>
        //         <pre>
        //             Scenario {key}: {value.throughput}{"\n"}
        //         </pre>
        //     </div>
        // ));
        //
        // let scoreComponents = Object.entries(this.state.scenarios).map(([key, value]) => (
        //     <div style={{margin: 15}}>
        //         <pre>
        //             Scenario {key}: {value.score} sec{"\n"}
        //         </pre>
        //     </div>
        // ));

        return (
            <Modal
                centered
                footer={null}
                visible={this.props.showComparePopup}
                onCancel={this.props.closeComparePopup}
                width={'80%'}
                bodyStyle={{
                    minHeight: '640px'
                }}>
                {/*<div>*/}
                {/*    <h1>Results</h1>*/}
                {/*    {scenarioComponents}*/}
                {/*    <h2>Execution Time</h2>*/}
                {/*    {executionTimeComponents}*/}
                {/*    <h2>Throughput</h2>*/}
                {/*    {throughputComponents}*/}
                {/*    <h2>Score</h2>*/}
                {/*    {scoreComponents}*/}
                {/*</div>*/}
                <div style={{marginTop: 15}}>
                    <Table
                        columns={this.state.columns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                    />
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        showComparePopup: state.nav.showComparePopup,
        idScenarios: state.nav.idScenarios,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        closeComparePopup: () => dispatch(navActions.closeComparePopup()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ComparePopupModal);
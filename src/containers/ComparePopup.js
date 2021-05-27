import React from "react";
import {connect} from 'react-redux';

import {Table, Modal, Badge, Tag} from "antd";

import * as navActions from "../store/actions/nav";
import axios from "axios";
import {config} from "../Constants";

class ComparePopupModal extends React.Component {

    state = {
        scenarios: {},
        columns: [],
        dataSource: [],
    };


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.idScenarios !== this.props.idScenarios) {
            console.log('ComparePopup: update compare scenarios');
            this.setState({
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
                        index: 'optimizer',
                    },
                    {
                        key: '8',
                        index: 'execution time',
                    },
                    {
                        key: '9',
                        index: 'throughput',
                    },
                    {
                        key: '10',
                        index: 'score',
                    },
                ],
            });


            this.props.idScenarios.forEach(x => {
                console.log('ComparePopup: get complete scenario ', x);
                this.get_complete_scenario(x);
            })
        }
    };

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
                // console.log(res);
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
                dataSource[1][id] = res.data.is_db ? res.data.table : res.data.dataset;
                dataSource[2][id] = res.data.mode;
                dataSource[3][id] = res.data.model;
                dataSource[4][id] = res.data.transforms ? res.data.transforms.length : 0;
                dataSource[5][id] = res.data.run_db ? 'QUERY' : 'ML';
                dataSource[6][id] = res.data.optimizer ? 'True' : 'False';
                dataSource[7][id] = res.data.execution_time;
                dataSource[8][id] = res.data.throughput;
                dataSource[9][id] = res.data.score;

                this.setState({
                    scenarios: scenarios,
                    dataSource: dataSource,
                    columns: columns
                });
            })
            .catch(err => {
                console.error(err.data);
                this.props.closePopup();
            });
    }


    render() {

        return (
            <Modal
                centered={true}
                footer={null}
                visible={this.props.showComparePopup}
                onCancel={this.props.closeComparePopup}
                width={'80%'}
            >
                <div style={{marginTop: 15}}>
                    <Table
                        columns={this.state.columns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                        scroll={{x: true}}
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
import React, {Component} from 'react'
import {connect} from 'react-redux';

import {Layout, List, Button} from 'antd';

import axios from "axios";

import * as buildActions from '../store/actions/build';
import * as itemsActions from "../store/actions/items";
import * as navActions from "../store/actions/nav";

import {config} from "../Constants";

import ComparePopup from "./ComparePopup";
import ScenarioCard from '../components/ScenarioCard'

const {Content} = Layout;

class History extends Component {

    state = {
        visible: false,
        scenarios: [],   // array of user scenarios
        compareScenario: false,
        compareList: [],
    };

    // initialize available scenarios
    componentDidMount() {
        console.log("History_componentDidMount");
        this.getScenarios();
    }

    // get scenarios
    getScenarios = () => {
        console.log("get available scenarios");
        let scenarios = [];

        axios
            .get('http://' + config.url.API_URL +
                `/api/msp/scenario/list/`)
            .then(res => {
                // console.log(res.data);
                let array = res.data;
                array.forEach(function (item, index) {
                    console.log(item, index);
                    scenarios.push({
                        id: item.id,
                        isDB: item.is_db,
                        dbUrl: item.db_url,
                        table: item.table,
                        dataset: item.dataset,

                        tables: item.tables,
                        columns: item.columns,

                        mode: item.mode,
                        labelsType: item.labelsType,
                        labels: item.labels,

                        transforms: item.transforms,
                        model: item.model,
                        runDB: item.run_db,
                        pipeline: item.pipeline,
                    })
                });
                this.setState({scenarios});
            })
            .catch(err => {
                console.error(err.data);
            });
    };

    getFakeScenarios = () => {
        let scenarios = [];
        scenarios.push({
            id: 1,
            isDB: true,
            dbUrl: 'mysql://connection',
            table: 'People',
            dataset: null,

            tables: ['People', 'Animals', 'Labels'],
            columns: ['person', 'age', 'sex'],

            mode: 'test',
            labelsType: 'table',
            labels: 'Labels',

            transforms: [{type: 'one_hot', column: 'sex'},
                {type: 'normalisation', column: 'age'}],
            model: 'gradient_boosting_classifier',
            runDB: true,
            pipeline: null
        });


        scenarios.push({
            id: 2,
            isDB: true,
            dbUrl: 'mysql://connection',
            table: 'People',
            dataset: null,

            tables: ['People', 'Animals'],
            columns: ['person', 'age', 'sex'],

            mode: 'train',
            labelsType: 'file',
            labels: null,

            transforms: [{type: 'one_hot', column: 'sex'},
                {type: 'normalisation', column: 'age'}],
            model: 'logistic_regression',
            runDB: false,
            pipeline: null
        });


        scenarios.push({
            id: 3,
            isDB: true,
            dbUrl: 'mssql://connection',
            table: 'People',
            dataset: null,

            tables: ['People', 'Animals'],
            columns: ['person', 'age', 'sex'],

            mode: 'test',
            labelsType: null,
            labels: null,

            transforms: null,
            model: 'logistic_regression',
            runDB: false,
            pipeline: null
        });

        scenarios.push({
            id: 4,
            isDB: false,
            dbUrl: null,
            table: null,
            dataset: null,

            tables: null,
            columns: ['temperature', 'water', 'wind'],

            mode: 'test',
            labelsType: null,
            labels: null,

            transforms: [{type: 'one_hot', column: 'temperature'}],
            model: 'sdca_maximum_entropy',
            runDB: false,
            pipeline: null
        });

        scenarios.push({
            id: 5,
            isDB: true,
            dbUrl: 'dbms://connection',
            table: 'People',
            dataset: null,

            tables: ['People', 'Animals'],
            columns: ['person', 'age', 'sex'],

            mode: 'train',
            labelsType: 'column',
            labels: 'age',

            transforms: null,
            model: 'gradient_boosting_classifier',
            runDB: false,
            pipeline: null
        });

        this.setState({scenarios});
    };

    removeScenario = (idx) => {
        console.log("remove scenario ", idx);
        let data = this.state.scenarios;
        let i;
        for (i = 0; i < data.length; ++i) {
            if (data[i].id === idx)
                break
        }
        if (i < data.length)
            data.splice(i, 1);
        this.setState({scenarios: data});

        axios
            .delete('http://' + config.url.API_URL +
                `/api/msp/scenario/?id=${idx}`)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.error(err.data);
            });
    };

    selectScenario = (s) => {
        this.props.builderSet(s);
        this.props.selectItem();
    };

    changeCompareList = (value, idx) => {
        let list = this.state.compareList;
        let i = list.indexOf(idx);
        if (i >= 0)
            list.splice(i, 1);
        else
            list.push(idx);
        this.setState({
            compareList: list,
        });
    };

    showResult = () => {
        console.log(this.state.compareList);
        if (this.state.compareScenario && this.state.compareList.length >= 2)
            this.props.openComparePopup(this.state.compareList);
            this.setState({
                compareList: [],
            })
    };

    render() {

        let scenario_cards = this.state.scenarios.map(x => {
            return (
                <ScenarioCard
                    scenario={x}
                    compareScenario={this.state.compareScenario}
                    selectScenario={() => this.selectScenario(x)}
                    removeScenario={(id) => this.removeScenario(id)}
                    changeScenarioCompare={(value, id) => this.changeCompareList(value, id)}
                />
            );
        });

        return (
            <Content style={{margin: '24px 16px 0'}}>
                <div style={{padding: '24px 0px 24px 24px', background: '#fff', minHeight: '100%'}}>
                    <div style={{
                        textAlign: 'right',
                        paddingRight: '24px',
                        marginBottom: '12px'
                    }}>
                        <Button type='link' onClick={() => {
                            this.showResult();
                            this.setState({compareScenario: !this.state.compareScenario});
                        }}>
                            {this.state.compareScenario ?
                                'Finish'
                                :
                                'Compare'}
                        </Button>
                    </div>
                    <List grid={{gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 4}}
                          dataSource={scenario_cards}
                          renderItem={item => (
                              <List.Item>
                                  {item}
                              </List.Item>
                          )}
                    />
                </div>
                <ComparePopup />
            </Content>
        );
    }
}

const mapStateToProps = state => {
    return {
        item: state.items.item,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        builderSet: (scenario) => dispatch(buildActions.builderSet(scenario)),
        selectItem: () => dispatch(itemsActions.selectItem('pipeline')),
        openComparePopup: (idScenarios) => dispatch(navActions.openComparePopup(idScenarios)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
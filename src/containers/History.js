import React, {Component} from 'react'
import {connect} from 'react-redux';

import * as buildActions from '../store/actions/build';

import {Layout, List, Button} from 'antd';

import ScenarioCard from '../components/ScenarioCard'
import * as itemsActions from "../store/actions/items";

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
        scenarios.push({
            key: 1,
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
            key: 2,
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
            key: 3,
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
            key: 4,
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
            key: 5,
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
            if (data[i].key === idx)
                break
        }
        if (i < data.length)
            data.splice(i, 1);
        this.setState({scenarios: data});

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
    };

    render() {

        let scenario_cards = this.state.scenarios.map(x => {
            return (
                <ScenarioCard
                    scenario={x}
                    compareScenario={this.state.compareScenario}
                    selectScenario={() => {
                        this.props.builderSet(x);
                        this.props.selectItem();
                    }}
                    removeScenario={(id) => this.removeScenario(id)}
                    changeScenarioCompare={(value, key) => this.changeCompareList(value, key)}
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
import React, {Component} from 'react'
import {connect} from 'react-redux';

import * as itemsActions from '../store/actions/items';

import {Layout, List} from 'antd';

import ScenarioCard from '../components/ScenarioCard'

const {Content} = Layout;

class History extends Component {

    state = {
        scenarios: []   // array of user scenarios
    };

    // initialize available scenarios
    componentDidMount() {
        console.log("History_componentDidMount");
        this.getScenarios();
    }

    // get scenarios
    getScenarios = () => {
        console.log("get available scenarios");
        var scenarios = [];
        scenarios.push({
            'key': 1,
            'is_db': true,
            'db_url': 'mysql://connection',
            'dataset_name': 'Invoices',
            'mode': 'test',
            'transforms': ['one_hot', 'normalisation'],
            'model': 'gradient_boosting_regressor',
            'on_db': true,
        });

        scenarios.push({
            'key': 2,
            'is_db': true,
            'db_url': 'mssql://connection',
            'dataset_name': 'Invoices',
            'mode': 'test',
            'transforms': ['one_hot', 'normalisation'],
            'model': 'gradient_boosting_regressor',
            'on_db': true,
        });

        scenarios.push({
            'key': 3,
            'is_db': true,
            'db_url': 'asfgh://connection',
            'dataset_name': 'Invoices',
            'mode': 'test',
            'transforms': ['one_hot', 'normalisation'],
            'model': 'gradient_boosting_regressor',
            'on_db': true,
        });

        scenarios.push({
            'key': 4,
            'is_db': false,
            'db_url': '',
            'dataset_name': 'weather_forecasting.csv',
            'mode': 'train',
            'transforms': [],
            'model': 'gradient_boosting_regressor',
            'on_db': false,
        });

        scenarios.push({
            'key': 5,
            'is_db': false,
            'db_url': '',
            'dataset_name': 'weather.csv',
            'mode': 'test',
            'transforms': ['normalisation'],
            'model': 'gradient_boosting_regressor',
            'on_db': true,
        });

        this.setState({
            scenarios: scenarios
        })
    };


    render() {

        let scenario_cards = this.state.scenarios.map(x => {
            return (
                <ScenarioCard
                    scenario={x}
                />
            );
        });

        return (
            <Content style={{margin: '24px 16px 0'}}>
                <div style={{padding: 24, background: '#fff', minHeight: '100%'}}>
                    <p>History</p><br/>

                    <List grid={{gutter: 16, xs: 1, sm: 1, md: 2, lg:3, xl: 4, xxl:4}}
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
        selectItem: (item) => dispatch(itemsActions.selectItem(item)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
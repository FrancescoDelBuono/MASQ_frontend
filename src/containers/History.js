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

    componentDidMount() {
        // Initialize available scenarios
        console.log("History: componentDidMount");
        this.getScenarios();
    }

    getScenarios = () => {
        // Get available scenarios
        console.log("History: get available scenarios");
        let scenarios = [];

        axios
            .get('http://' + config.url.API_URL +
                `/api/msp/scenario/list/`)
            .then(res => {
                // console.log(res.data);
                let array = res.data;
                array.forEach(function (item, index) {
                    // console.log(item, index);
                    scenarios.push({
                        id: item.id,
                        isDB: item.is_db,
                        dbUrl: item.db_url,
                        table: item.table,
                        dataset: item.dataset,

                        tables: item.tables,
                        columns: item.columns,

                        mode: item.mode,
                        labelsType: item.labels_type,
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

    removeScenario = (idx) => {
        // Delete the selected scenario
        console.log("History: remove scenario ", idx);
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
                console.error(err);
            });
    };

    selectScenario = (s) => {
        // Select scenario s and go to pipeline tab
        console.log('History: select scenario ', s.id);
        console.log(s);
        this.props.builderSet(s);
        this.props.selectItem();
    };

    changeCompareList = (value, idx) => {
        // Modify selected item
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

    showComparison = () => {
        // Show comparison
        if (this.state.compareScenario && this.state.compareList.length >= 2) {
            console.log('History: open Compare Popup ', this.state.compareList.join(', '));
            this.props.openComparePopup(this.state.compareList);
            this.setState({
                compareList: [],
            });
        } else
            this.setState({
                compareList: [],
            });
    };

    showDetail = (id) => {
        // Show detail of the given scenario
        console.log('History: show detail ', id);
        this.props.openPopup('detail', id)
    };

    render() {

        let scenarioCards = this.state.scenarios.map(x => {
            return (
                <ScenarioCard
                    scenario={x}
                    showDetail={this.showDetail}
                    removeScenario={this.removeScenario}
                    selectScenario={() => this.selectScenario(x)}
                    compareScenario={this.state.compareScenario}
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
                            this.showComparison();
                            this.setState({compareScenario: !this.state.compareScenario});
                        }}>
                            {this.state.compareScenario ?
                                'Finish'
                                :
                                'Compare'}
                        </Button>
                    </div>
                    <List grid={{gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 4}}
                          dataSource={scenarioCards}
                          renderItem={item => (
                              <List.Item>
                                  {item}
                              </List.Item>
                          )}
                    />
                </div>
                <ComparePopup/>
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
        openPopup: (name, id) => dispatch(navActions.openPopup(name, id)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
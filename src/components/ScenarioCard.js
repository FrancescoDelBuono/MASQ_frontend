import React from 'react';

import {Card, Icon} from 'antd';

import {get_background} from '../data/server_images';

// deleting the selected scenario
const delScenario = (code) => {
    console.log('delete scenario ' + code)
};

// execute the selected scenario
const selectScenario = (code) => {
    console.log('select scenario ' + code)
};


// Single Scenario UI
const ScenarioCard = (props) => {
    const width = 240;
    // const logo = require('../data/img/mysql.png');
    let name = "no_dbms";
    if (props.scenario.is_db)
        name = props.scenario.db_url;

    return (<Card key={props.scenario.key}
                  style={{width: width}}
                  cover={
                      <img
                          alt="example"
                          // src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                          src={get_background(name)}
                          width={width}
                      />
                  }
                  actions={[
                      // <Button icon="check" onClick={() => this.selectScenario(x.key)}/>,
                      // <Button icon="delete" type="danger" onClick={() => this.delScenario(x.key)}/>,
                      <Icon type="check" key="setting" onClick={() => selectScenario(props.scenario.key)}/>,
                      <Icon type="delete" key="edit" onClick={() => delScenario(props.scenario.key)}/>,
                  ]}
    >
        <Card.Meta
            title={'scenario: ' + props.scenario.key}
            description={
                <pre>
                    is_db: {props.scenario.is_db ? 'true' : 'false'}{"\n"}
                    db_url: {props.scenario.db_url}{"\n"}
                    dataset_name: {props.scenario.dataset_name}{"\n"}
                    mode: {props.scenario.mode}{"\n"}
                    model: {props.scenario.model}{"\n"}
                    on_db: {props.scenario.on_db ? 'true' : 'false'}{"\n"}
                    {'1' in props.scenario ? props.scenario['1'] + "\n" : ''}
                        </pre>
            }/>
    </Card>);
};

export default ScenarioCard;
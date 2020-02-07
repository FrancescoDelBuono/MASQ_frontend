import React from 'react';

import {Badge, Card, Switch, Icon} from 'antd';

import {get_background} from '../data/server_images';


// Single Scenario UI
const ScenarioCard = (props) => {
    const width = 240;
    const height = 135;
    // const logo = require('../data/img/mysql.png');
    let name = "no_dbms";
    if (props.scenario.isDB)
        name = props.scenario.dbUrl;

    let actions = [
        <Icon type="check" key="setting" onClick={props.selectScenario}/>,
        <Icon type="delete" key="edit" onClick={() => props.removeScenario(props.scenario.key)}/>
    ];

    if (props.compareScenario) {
        actions.push(
            <Switch onClick={(e) =>
                props.changeScenarioCompare(e, props.scenario.key)}/>,
        )
    }

    return (
        <Card key={props.scenario.key}
              style={{width: width}}
              cover={
                  <img
                      alt="example"
                      src={get_background(name)}
                      width={width}
                      height={height}
                  />}
              actions={actions}>
            <Card.Meta
                title={'Scenario ' + props.scenario.key}
                description={
                    <pre style={{width: 240}}>
                    {
                        props.scenario.isDB ?
                            <Badge status="processing" text="DBMS"/>
                            :
                            <Badge status="warning" text="Dataset"/>
                    }{"\n"}
                        {
                            props.scenario.isDB ?
                                props.scenario.table
                                :
                                'props.scenario.dataset[0].name'
                        }{"\n"}
                        {props.scenario.mode}{"\n"}
                        {props.scenario.labelsType ?
                            props.scenario.labelsType
                            :
                            'NO Labels'
                        }{"\n"}
                        {props.scenario.model}{"\n"}
                        {props.scenario.transforms ? props.scenario.transforms.length : 0} transforms{"\n"}
                        {
                            props.scenario.runDB ?
                                <Badge status="processing" text="query DBMS"/>
                                :
                                <Badge status="default" text="ML Library"/>
                        }{"\n"}
                </pre>
                }/>
        </Card>);
};

export default ScenarioCard;
import React from 'react';

import {Badge, Card, Switch, Icon} from 'antd';

import {get_background} from '../data/server_images';
import * as navActions from "../store/actions/nav";
import {connect} from "react-redux";


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
        <Icon type="info" key="setting" onClick={() => {
            props.openPopup('result', props.scenario.id)
        }}/>,
        <Icon type="delete" key="edit" onClick={() => props.removeScenario(props.scenario.id)}/>
    ];

    if (props.compareScenario) {
        // actions.push(
        //     <Switch onClick={(e) =>
        //         props.changeScenarioCompare(e, props.scenario.key)}/>,
        // )
        actions = [<Switch onClick={(e) => props.changeScenarioCompare(e, props.scenario.id)}/>]
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
                title={'Scenario ' + props.scenario.id}
                description={
                    <pre style={{width: 240, maxWidth: 240}}>
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
                                // 'props.scenario.dataset[0].name'
                                props.scenario.dataset
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

const mapDispatchToProps = dispatch => {
    return {
        openPopup: (name, id) => dispatch(navActions.openPopup(name, id)),
    }
};

export default connect(null, mapDispatchToProps)(ScenarioCard);
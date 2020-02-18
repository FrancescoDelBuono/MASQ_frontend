import React, {Component} from 'react'
import {connect} from 'react-redux';

import * as itemsActions from '../store/actions/items';

import {Layout, Descriptions, Badge} from 'antd';

const {Content} = Layout;

class Overview extends Component {

    render() {
        return (
            <Content style={{margin: '24px 16px 0'}}>
                <div style={{padding: 24, background: '#fff', minHeight: 300}}>
                    <Descriptions title="Overview" bordered>
                        {this.props.isDB === true &&
                        <Descriptions.Item label="DBMS" span={2}>{this.props.dbUrl}</Descriptions.Item>}
                        {this.props.isDB === true &&
                        <Descriptions.Item label="Table" span={1}>{this.props.table}</Descriptions.Item>}

                        {this.props.isDB === false &&
                        <Descriptions.Item label="File" span={3}>
                            {this.props.dataset ? this.props.dataset[0].name : 'this.props.dataset[0].name'}
                        </Descriptions.Item>}

                        {this.props.isDB === null &&
                        <Descriptions.Item label="" span={3}>no database is selected</Descriptions.Item>}


                        <Descriptions.Item label="Mode">{this.props.mode}</Descriptions.Item>
                        {this.props.labelsType &&
                        <Descriptions.Item label="Labels Type">{this.props.labelsType}</Descriptions.Item>}

                        {this.props.labelsType === 'file' &&
                        <Descriptions.Item label="Labels">
                            {this.props.labels ? this.props.labels[0].name : 'this.props.dataset[0].name'}
                        </Descriptions.Item>}

                        {this.props.labelsType === 'column' &&
                        <Descriptions.Item label="Labels">
                            {this.props.labels}
                        </Descriptions.Item>}

                        {this.props.labelsType === 'table' &&
                        <Descriptions.Item label="Labels">
                            {this.props.labels}
                        </Descriptions.Item>}

                        {this.props.labelsType === null &&
                        <Descriptions.Item label="Labels" span={2}>no labels</Descriptions.Item>}

                        <Descriptions.Item label="Run on DB">
                            {
                                this.props.runDB ?
                                    <Badge status="processing" text="Run"/>
                                    :
                                    <Badge status="default" text="No"/>
                            }
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Model">{this.props.model ? this.props.model : 'no model selected'}</Descriptions.Item>
                        <Descriptions.Item label="Transforms">
                            {
                                this.props.transforms &&
                                this.props.transforms.length > 0 ?
                                    <Badge status="success"/>
                                    :
                                    <Badge status="default"/>
                            }
                            {this.props.transforms ? this.props.transforms.length : 0} transforms
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </Content>
        );
    }
}

const mapStateToProps = state => {
    return {
        isDB: state.build.isDB,
        dataset: state.build.dataset,
        dbUrl: state.build.dbUrl,
        table: state.build.table,
        columns: state.build.columns,

        mode: state.build.mode,
        labelsType: state.build.labelsType,
        labels: state.build.labels,
        validation: state.build.validation,

        model: state.build.model,
        transforms: state.build.transforms,
        pipeline: state.build.pipeline,
        runDB: state.build.runDB,

    }
};

const mapDispatchToProps = dispatch => {
    return {
        selectItem: (item) => dispatch(itemsActions.selectItem(item)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
import React, {Component} from 'react'
import {connect} from 'react-redux';

import * as itemsActions from '../store/actions/items';
import * as navActions from "../store/actions/nav";

import {Layout, Row, Col, Steps, Button, Divider, message,} from 'antd';

import DatasetForm from "../components/DatasetForm";
import ModalityForm from "../components/ModalityForm";
import ModelForm from "../components/ModelForm";
import Popup from "./Popup";

const {Content} = Layout;
const {Step} = Steps;


const steps = [
    {
        title: 'Dataset',
        content: 'Dataset Form',
    },
    {
        title: 'Modality',
        content: 'Modality Form',
    },
    {
        title: 'Model',
        content: 'Model Form',
    },
];


class Builder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        };
    }

    onChange = current => {
        console.log('onChange:', current);
        this.setState({current});
    };

    next() {
        const current = this.state.current + 1;
        this.setState({current});
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({current});
    }

    render() {
        const {current} = this.state;

        return (
            <Content style={{margin: '24px 16px 0'}}>
                <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                    <Steps current={current} onChange={this.onChange} status='process'>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title}/>
                        ))}
                    </Steps>
                    <Divider/>
                    <div style={{
                        margin: '16px',
                        paddingTop: '30px',
                        minHeight: '250px',
                        // border: 'solid',
                        // borderColor: 'red',
                        // textAlign: 'center',
                    }}>
                        {steps[current].title === 'Dataset' &&
                        <DatasetForm/>
                        }
                        {steps[current].title === 'Modality' &&
                        <ModalityForm/>
                        }
                        {steps[current].title === 'Model' &&
                        <ModelForm/>
                        }
                    </div>
                    <div style={{marginTop: '24px'}}>
                        <Row type="flex" justify="space-between" align="middle">
                            <Col span={4} style={{textAlign: 'left'}}>
                                {current > 0 && (
                                    <Button type="normal" shape="circle" size="large" icon={"left"}
                                            onClick={() => this.prev()}/>
                                )}
                            </Col>
                            <Col span={4} offset={16} style={{textAlign: 'right'}}>
                                {current === steps.length - 1 && (
                                    <Button type="primary" onClick={() => {
                                        message.success('Processing complete!')
                                        this.props.openPopup('result')
                                    }}>
                                        Execute
                                    </Button>
                                )}
                                {current < steps.length - 1 && (
                                    <Button type="primary" shape="circle" size="large" icon={"right"}
                                            onClick={() => this.next()}/>
                                )}
                            </Col>
                        </Row>
                    </div>
                </div>
                <Popup />
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
        openPopup: (name) => dispatch(navActions.openPopup(name)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Builder);
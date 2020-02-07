import React, {Component} from 'react'
import {connect} from 'react-redux';

import * as itemsActions from '../store/actions/items';

import {Layout, Menu, Icon} from 'antd';

const {Sider} = Layout;

class Sidepanel extends Component {
    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({collapsed});
    };

    handleClick = e => {
        console.log('click ', e);
    };

    render() {
        return (
            <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                <div style={{
                    height: '32px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    margin: '16px',
                }}/>
                <Menu theme="dark" mode="inline" selectedKeys={this.props.item}  onClick={(e) => this.props.selectItem(e.key)}>
                    <Menu.Item key="pipeline">
                        <Icon type="cluster"/>
                        <span>Pipeline</span>
                    </Menu.Item>
                    <Menu.Item key="history">
                        <Icon type="file"/>
                        <span>History</span>
                    </Menu.Item>
                    <Menu.Item key="testing">
                        <Icon type="setting"/>
                        <span>Info</span>
                    </Menu.Item>
                </Menu>
            </Sider>
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

export default connect(mapStateToProps, mapDispatchToProps)(Sidepanel);
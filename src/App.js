import React, {Component} from 'react';
import {connect} from "react-redux";

import './App.css';
import "antd/dist/antd.css";

import {Layout, PageHeader} from 'antd';
import Sidepanel from './containers/Sidepanel';
import Builder from './containers/Builder';
import Overview from './containers/Overview';
import History from "./containers/History";
import Popup from "./containers/ExecutionPopup";


const {Header, Footer} = Layout;

class App extends Component {
    render() {
        let title;
        switch (this.props.item) {
            case 'pipeline':
                title = 'Builder';
                break;
            case 'history':
                title = 'History';
                break;
            default:
                title = 'MASQ';
                break;
        }

        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sidepanel/>

                <Layout>
                    <Header style={{background: '#fff', padding: 0}}>
                        <PageHeader
                            style={{
                                border: '1px solid rgb(235, 237, 240)',
                            }}
                            title="MASQ"
                            subTitle={title}
                        />
                    </Header>
                    {this.props.item === 'history' && <History/>}
                    {this.props.item === 'pipeline' && <Builder/>}
                    {this.props.item === 'pipeline' && <Overview/>}
                    <Popup/>
                    <Footer style={{textAlign: 'center'}}>....</Footer>
                </Layout>

            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        item: state.items.item,
    }
};


export default connect(mapStateToProps, null)(App);



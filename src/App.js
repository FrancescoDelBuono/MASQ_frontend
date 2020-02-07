import React, {Component} from 'react';
import {connect} from "react-redux";

import './App.css';
import "antd/dist/antd.css";

import {Layout} from 'antd';
import Sidepanel from './containers/Sidepanel';
import Builder from './containers/Builder';
import Overview from './containers/Overview';
import History from "./containers/History";


const {Header, Footer} = Layout;

class App extends Component {
    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sidepanel/>

                <Layout>
                    <Header style={{background: '#fff', padding: 0}}/>
                    { this.props.item === 'history' && <History/> }
                    { this.props.item === 'pipeline' && <Builder/> }
                    { this.props.item === 'pipeline' && <Overview/> }
                    <Footer style={{textAlign: 'center'}}>Mmmmmmh......</Footer>
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



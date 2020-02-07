import React from "react";
import {connect} from 'react-redux';

import {Modal} from "antd";

import * as navActions from "../store/actions/nav";

class PopupModal extends React.Component {
    render() {
        return (
            <Modal
                centered
                footer={null}
                visible={this.props.showPopup}
                onCancel={this.props.closePopup}
                width={'80%'}
                bodyStyle={{
                    height: '640px'
                }}>
                <div>
                    <h1>{this.props.namePopup}</h1>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        showPopup: state.nav.showPopup,
        namePopup: state.nav.namePopup,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        closePopup: () => dispatch(navActions.closePopup()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupModal);
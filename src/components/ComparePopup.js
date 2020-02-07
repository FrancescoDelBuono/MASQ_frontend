import React from "react";

import {Modal} from "antd";

class ComparePopup extends React.Component {
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
                    <h1>{this.props.scenarios}</h1>
                </div>
            </Modal>
        );
    }
}

export default ComparePopup;
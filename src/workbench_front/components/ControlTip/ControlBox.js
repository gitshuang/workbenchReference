import React, { Component } from "react";
import { Modal ,Button } from 'antd';
import { langCheck } from 'Pub/js/utils';
import './index.less';
class ControlBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true
        };
    }
    /* 取消按钮事件 */
    handleCancel = () => {
        if (this.props.cancelClick && typeof this.props.cancelClick === 'function') {
            this.props.cancelClick();
        }
        this.setState({
            visible: false
        });
        this.close();
    };
    //删除弹框
	close = () => {
		let element = document.getElementsByClassName('prompt-project')[0];
		if (element) {
			ReactDOM.unmountComponentAtNode(element);
			clearTimeout(this.closeTimer);
			this.closeTimer = null;
			document.getElementById('app').removeChild(element);
		}
	};
    //确认按钮事件
    handleOk = () => {
        if (this.props.okClick && typeof this.props.okClick === 'function') {
            this.props.okClick();
        }
        this.setState({
            visible: false
        });
        this.close();
    };
    render() {
        return (
            <Modal
                mask={true}
                closable={false}
                title={langCheck('0000PUB-000257')}/* 国际化处理： 提示消息*/
                visible={this.state.visible}
                onOk={this.handleOk}
                okText={langCheck('0000PUB-000001')}/* 国际化处理： 确定*/
                cancelText={langCheck('0000PUB-000000')}/* 国际化处理： 取消*/
                centered={true}
                onCancel={this.handleCancel}
                maskClosable={false}
                width={410}
                height={200}
                className={'prompt-box-project'}
                footer={[this.props.isOkBtn&&(<Button 
                    onClick={this.handleOk}
                    type="primary"
                 >
                    {langCheck('0000PUB-000001')}
                </Button>),this.props.isCancelBtn&&(<Button 
							onClick={this.handleCancel}
						>
							{langCheck('0000PUB-000000')}
						</Button>)]}
            >        
            {this.props.toastIcon}
                <p className='prompt-content'>{this.props.msg}</p>
            </Modal>
        );
    }
}
export default ControlBox;

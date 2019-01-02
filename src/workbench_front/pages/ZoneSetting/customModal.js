import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button } from "antd";
import DefdocListGridRef from "Components/Refers/DefdocListGridRef";
import { langCheck } from "Pub/js/utils";
import { getMulti } from 'Pub/js/getMulti';
//自定义档案模态框组件类
class CustomModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initVal: this.props.initVal,
            refname: this.props.refname,
            json: {}
        };
    }
    //更新自定义档案取值
    componentWillReceiveProps(nextProps) {
        // porps发生变化时执行,初始化render时不执行
        this.setState({ 
            initVal: nextProps.initVal,
            refname: nextProps.refname
        });
    }
    //设置模态框隐藏
    showModalHidden = () => {
        this.props.setModalVisibel("customModalVisibel", false);
    };
    //更新dataval字段
    onOkDialog = () => {
        let { initVal, refname } = this.state;
        this.props.handleSelectChange(initVal, "dataval"); // 特殊处理下 这里是对象
        this.showModalHidden();
    };

    componentDidMount() {
        //多语
        let callback = (json) => {
			// console.log('json', json);
            this.setState({
                json:json
            });
        };
        getMulti({
            moduleId: 'ZoneSetting',
            // currentLocale: 'zh-CN',
            domainName: 'workbench',
            callback
        });
    }

    render() {
        let { initVal, refname, json } = this.state;
        return (
            <div className="myZoneModal">
                <Modal
                    closable={false}
                    title={langCheck('ZoneSetting-000022', 'pages', json)}/* 国际化处理： 类型设置*/
                    mask={false}
                    wrapClassName="zonesetting-customModal"
                    visible={this.props.modalVisibel}
                    onOk={this.onOkDialog}
                    destroyOnClose={true}
                    onCancel={this.showModalHidden}
                    // onChange={this.props.refname}
                    footer={[
                        <Button
                            key="submit"
                            // disabled={}
                            type="primary"
                            onClick={this.onOkDialog}
                        >
                            {langCheck('ZoneSetting-000005', 'pages', json)}
                            {/* /* 国际化处理： 确定*/ }
                        </Button>,
                        <Button key="back" onClick={this.showModalHidden}>
                            {langCheck('ZoneSetting-000006', 'pages', json)}
                            {/* /* 国际化处理： 取消*/ }
                        </Button>
                    ]}
                >
                    <DefdocListGridRef
                        value={{ refpk: initVal, refname: refname, refcode: "" }}
                        placeholder={langCheck('ZoneSetting-000023', 'pages', json)}/* 国际化处理： 自定义档案*/
                        onChange={val => {
                            this.setState({
                                initVal: val && val.refpk,
                                refname: val && val.refname
                            });
                        }}
                    />
                </Modal>
            </div>
        );
    }
}
export default connect(
    state => ({}),
    {}
)(CustomModal);

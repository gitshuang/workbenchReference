import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button } from "antd";
import { updateAreaList } from "Store/ZoneSetting/action";
import BatchTable from "./batchTable";
import { langCheck } from 'Pub/js/utils';
//批量设置模态框组件类
class BatchSettingModal extends Component {
    constructor(props) {
        super(props);
        let { areaList, areaIndex } = this.props;
        this.state = {
            newSource: areaList[areaIndex].queryPropertyList
        };
    }
    //模态框显示时，进行数据初始化
    componentWillReceiveProps(nextProps) {
        if (nextProps.batchSettingModalVisibel !== true) {
            return;
        } else {
            let { areaList, areaIndex } = nextProps;
            this.setState({ newSource: areaList[areaIndex].queryPropertyList });
        }
    }
    //批量设置的模态框的隐藏
    showModalHidden = () => {
        this.props.setModalVisibel(false);
    };
    //点击确定按钮
    onOkDialog = () => {
        let { areaList, areaIndex } = this.props;
        areaList = _.cloneDeep(areaList);
        areaList[areaIndex].queryPropertyList = this.state.newSource;
        this.props.updateAreaList(areaList);
        this.showModalHidden();
    };
    saveNewSource = newSource => {
        this.setState({ newSource });
    };
    render() {
        let { areaIndex, areaList, json } = this.props;
        let { newSource } = this.state;
        return (
            <Modal
                closable={true}
                className="zonesetting-batch-setting-modal"
                title={langCheck('ZoneSetting-000016', 'pages', json)}/* 国际化处理： 批量设置-卡片区*/
                mask={false}
                maskClosable={false}
                visible={this.props.batchSettingModalVisibel}
                onOk={this.onOkDialog}
                destroyOnClose={true}
                onCancel={this.showModalHidden}
                width="80%"
                footer={[
                    <Button
                        key="submit"
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
                <BatchTable
                    newSource={newSource}
                    areatype={areaList[areaIndex].areatype}
                    saveNewSource={this.saveNewSource}
                />
            </Modal>
        );
    }
}
export default connect(
    state => ({
        areaList: state.zoneSettingData.areaList
    }),
    {
        updateAreaList
    }
)(BatchSettingModal);

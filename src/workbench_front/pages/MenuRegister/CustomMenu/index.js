import React, { Component } from "react";
import { Modal } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setModalVisible } from "Store/MenuRegister/action";
import TreeTransfer from "./TreeTransfer";
import Ajax from "Pub/js/ajax";
import Notice from "Components/Notice";
import { langCheck } from "Pub/js/utils";
import "./index.less";
class CustomMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    /**
     * 确定关闭
     */
    handleOk = () => {
        let langMultiData = this.props.langMultiData;
        let treeData = this.props.getSelectedTreeData();
        if (treeData.length === 0) {
            Notice({
                status: "warning",
                msg: langCheck("102202MENU-000036", true, langMultiData)
            }); /* 国际化处理： 已选数据不能为空！*/
            return;
        }
        let menuItemCodes = treeData.map(item => {
            return item.code;
        });
        Ajax({
            url: `/nccloud/platform/appregister/upgradedefappmenu.do`,
            info: {
                name: langCheck(
                    "102202MENU-000032",
                    true,
                    langMultiData
                ) /* 国际化处理： 菜单自定义升级*/,
                action: langCheck(
                    "102202MENU-000001",
                    true,
                    langMultiData
                ) /* 国际化处理： 保存*/
            },
            data: {
                pk_menu: this.props.menuId,
                menuItemCodes
            },
            success: ({ data: { data } }) => {
                if (data) {
                    this.props.setModalVisible(false);
                    Notice({ status: "success", msg: data.msg });
                }
            }
        });
    };
    /**
     * 模态框关闭
     */
    handleCancel = () => {
        this.props.setModalVisible(false);
    };
    render() {
        let { visible } = this.props;
        let langMultiData = this.props.langMultiData;
        return (
            <Modal
                title={langCheck(
                    "102202MENU-000032",
                    true,
                    langMultiData
                )} /* 国际化处理： 菜单自定义升级*/
                className="treetransfer-modal"
                width={845}
                centered={true}
                destroyOnClose={true}
                maskClosable={false}
                // closable={false}
                visible={visible}
                okText={langCheck(
                    "102202MENU-000027",
                    true,
                    langMultiData
                )} /* 国际化处理： 确定*/
                cancelText={langCheck(
                    "102202MENU-000002",
                    true,
                    langMultiData
                )} /* 国际化处理： 取消*/
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <TreeTransfer langMultiData={langMultiData} />
            </Modal>
        );
    }
}
CustomMenu.propTypes = {
    visible: PropTypes.bool.isRequired,
    menuId: PropTypes.string.isRequired,
    getSelectedTreeData: PropTypes.object.isRequired,
    setModalVisible: PropTypes.object.isRequired
};
export default connect(
    ({ menuRegisterData }) => ({
        getSelectedTreeData: menuRegisterData.getSelectedTreeData,
        visible: menuRegisterData.visible,
        menuId: menuRegisterData.menuId
    }),
    { setModalVisible }
)(CustomMenu);

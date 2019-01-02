import React, { Component } from "react";
import { Button, Input, Modal } from "antd";
import Notice from "Components/Notice";
import Ajax from "Pub/js/ajax";
import { DeferFn } from "Pub/js/utils";
import { langCheck } from "Pub/js/utils";
/**
 * @param {Object} multiData 多语对象
 * @param {Boolean} isShow  是否显示
 */
class ExportAppBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            visible: false
        };
    }
    /**
     * 导出页面模板
     */
    exportTemplateBtn = () => {
        let { multiData } = this.props;
        let { value } = this.state;
        DeferFn(() => {
            Ajax({
                url: `/nccloud/platform/templet/extractSel.do`,
                info: {
                    name: langCheck(
                        "102202APP-000072",
                        "pages",
                        multiData
                    ) /* 国际化处理： 应用注册页面*/,
                    action: langCheck(
                        "102202APP-000073",
                        "pages",
                        multiData
                    ) /* 国际化处理： 导出页面模板多语*/
                },
                loading: true,
                data: {
                    filepath: value
                },
                success: ({ data }) => {
                    if (data.success && data.data) {
                        this.handleCancel();
                        Notice({
                            status: "success",
                            msg: data.data
                        });
                    }
                }
            });
        });
    };
    //
    handleClick = () => {
        this.setState({
            value: "",
            visible: true
        });
    };
    handleChange = e => {
        this.setState({
            value: e.target.value
        });
    };
    handleOk = () => {
        if (this.state.value.length > 0) {
            this.exportTemplateBtn();
        } else {
        }
    };
    handleCancel = () => {
        this.setState({
            value: "",
            visible: false
        });
    };
    render() {
        let { visible, value } = this.state;
        let { multiData, isShow } = this.props;
        if (!isShow) {
            return null;
        }
        return (
            <div>
                <Button type="primary" onClick={this.handleClick}>
                    {/* {langCheck("102202APP-000091", "pages", multiData)} */}
                    补充抽取下拉
                </Button>
                <Modal
                    maskClosable={false}
                    closable={false}
                    width={700}
                    title={"文件路径"}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText={langCheck(
                        "0000PUB-000000"
                    )} /* 国际化处理： 取消*/
                    okText={langCheck("0000PUB-000001")} /* 国际化处理： 确定*/
                >
                    <Input value={value} onChange={this.handleChange} />
                </Modal>
            </div>
        );
    }
}
export default ExportAppBtn;

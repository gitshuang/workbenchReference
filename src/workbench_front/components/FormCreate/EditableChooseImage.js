import React, { Component } from "react";
import { Tooltip } from "antd";
import ChooseImageForForm from "Components/ChooseImageForForm";
/**
 * 表格编辑单元格 - String类型
 */
class EditableString extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }
    /**
     * 与 antd form 表单传递数据的方法
     * @param {String} changeValue  改变的 value 值
     */
    handleChange = changedValue => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(changedValue);
        }
    };
    handleMouseEnter = () => {
        this.setState({ visible: true });
    };
    handleMouseLeave = () => {
        this.setState({ visible: false });
    };
    render() {
        let { form } = this.props;
        let errorMsg = form.getFieldError(this.props.id);
        let hasError = errorMsg ? true : false;
        return (
            <Tooltip
                placement="top"
                overlayClassName='tootip-white'
                visible={this.state.visible && hasError}
                title={errorMsg && errorMsg[errorMsg.length - 1]}
            >
                <div
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                >
                    <ChooseImageForForm {...this.props} />
                </div>
            </Tooltip>
        );
    }
}
export default EditableString;

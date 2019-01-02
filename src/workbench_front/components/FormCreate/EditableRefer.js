import React, { Component } from "react";
import { Tooltip } from "antd";
import { high } from "nc-lightapp-front";
const { Refer } = high;
/**
 * 表单编辑 - Refer类型
 */
class EditableRefer extends Component {
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
        let { value, form, options } = this.props;
        let errorMsg = form.getFieldError(this.props.id);
        let hasError = errorMsg ? true : false;
        return (
            <Tooltip
                placement="top"
                overlayClassName="tootip-white"
                visible={this.state.visible && hasError}
                title={errorMsg && errorMsg[errorMsg.length - 1]}
            >
                <div
                    style={{ height: "30px" }}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                >
                    <Refer
                        value={value}
                        onChange={this.handleChange}
                        {...options}
                    />
                </div>
            </Tooltip>
        );
    }
}
export default EditableRefer;

import React, { Component } from "react";
import { Select, Tooltip } from "antd";
const Option = Select.Option;
/**
 * 表单编辑 - Select类型
 */
class EditableSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }
    /**
     * 创建 下拉内容
     * @param {Array} options 下拉项数组
     */
    createOption = options => {
        return options.map((item, index) => {
            return (
                <Option title={item.text} key={item.value} value={item.value}>
                    {item.text}
                </Option>
            );
        });
    };
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
        let { value, form, placeholder } = this.props;
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
                    style={{height:'30px'}}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                >
                    <Select
                        value={value}
                        placeholder={placeholder}
                        onChange={this.handleChange}
                    >
                        {this.createOption(this.props.options)}
                    </Select>
                </div>
            </Tooltip>
        );
    }
}
export default EditableSelect;

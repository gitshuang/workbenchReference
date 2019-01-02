import React, { Component } from "react";
import { Select } from "antd";
import { cellNonempty } from "./Util";
const Option = Select.Option;
/**
 * 表格编辑单元格 - Select类型
 */
class EditableCellSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }
    /**
     * 值改变
     */
    handleSelect = selected => {
        const { cellKey, cellIndex, cellChange } = this.props;
        cellChange(cellKey, cellIndex, selected);
    };
    /**
     * 获得焦点
     */
    handleFocus = () => {
        this.setState({ hasError: false });
    };
    /**
     * 鼠标移出
     */
    handleBlur = selected => {
        if (this.props.cellRequired) {
            if (cellNonempty(selected)) {
                this.props.setCellEdit(false);
            } else {
                this.props.setCellEdit(true);
                this.setState({ hasError: true });
            }
        } else {
            this.props.setCellEdit(false);
        }
    };
    /**
     * 创建 下拉列表
     * @param {Array} optionsList - [{value:'value值',text:'显示值'}]
     */
    createOptions = optionsList => {
        return optionsList.map(item => {
            return (
                <Option key={item.value} value={item.value}>
                    {item.text}
                </Option>
            );
        });
    };
    render() {
        return (
            <Select
                value={this.props.value}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onSelect={this.handleSelect}
                getPopupContainer={()=>this.props.refNode}
            >
                {this.createOptions(this.props.options)}
            </Select>
        );
    }
}
export default EditableCellSelect;

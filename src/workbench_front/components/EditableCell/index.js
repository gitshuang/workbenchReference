import React, { Component } from "react";
import { cellValue } from "./Util";
import EditableCellShow from "./EditableCellShow";
import EditableCellPublic from "./EditableCellPublic";
import EditableCellString from "./EditableCellString";
import EditableCellSelect from "./EditableCellSelect";
import EditableCellMultiLang from "./EditableCellMultiLang";
import "./index.less";
/**
 * 可编辑表格单元格
 * @param {String} type 可编辑单元格类型 string - 字符串 select - 下拉
 * @param {String} value 表格单元格值
 * @param {Boolen} editable 表格单元格编辑性
 * @param {Number} cellIndex 单元格所在行下标
 * @param {String} cellKey 单元格的key
 * @param {Boolen} cellRequired 单元格是否必输
 * @param {Function} cellChange 单元格编辑事件
 * @param {Array|Object} options 单元格为下拉时 options - [{value:'下拉项value值',text:'下拉项显示的内容'}]为数组 当是其他类型时为对象
 * @param {String} cellMark 多语文本字段标识
 */
class EditableCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cellEditable: false
        };
    }
    /**
     * 单元格是否显示输入框
     */
    handleCellEditableChange = editType => {
        this.setState({ cellEditable: editType });
    };
    /**
     * 表格单元格选择
     * @param {Object} props
     */
    switchCell = props => {
        let {
            type,
            cellKey,
            cellIndex,
            value,
            cellChange,
            cellRequired,
            cellCheck,
            options,
            cellErrorMsg,
            cellMark
        } = props;
        switch (type) {
            case "string":
                return (
                    <EditableCellString
                        cellKey={cellKey}
                        cellIndex={cellIndex}
                        setCellEdit={this.handleCellEditableChange}
                        value={value}
                        cellChange={cellChange}
                        cellRequired={cellRequired}
                        cellCheck={cellCheck}
                        cellErrorMsg={cellErrorMsg}
                    />
                );
            case "select":
                return (
                    <EditableCellSelect
                        cellKey={cellKey}
                        cellIndex={cellIndex}
                        setCellEdit={this.handleCellEditableChange}
                        value={value}
                        cellChange={cellChange}
                        cellRequired={cellRequired}
                        options={options}
                        cellErrorMsg={cellErrorMsg}
                        refNode={this.refs["tableEditableCell"]}
                    />
                );
            case "multiString":
                return (
                    <EditableCellMultiLang
                        cellKey={cellKey}
                        cellIndex={cellIndex}
                        setCellEdit={this.handleCellEditableChange}
                        value={value}
                        cellChange={cellChange}
                        cellRequired={cellRequired}
                        options={options}
                        cellErrorMsg={cellErrorMsg}
                        cellMark={cellMark}
                        cellCheck={cellCheck}
                    />
                );
            default:
                break;
        }
    };
    /**
     * 表格单元格渲染
     */
    renderCell = props => {
        // 当前单元格是否为编辑态
        if (props.editable) {
            // 单元格内部是否显示输入框 即内部编辑态
            if (this.state.cellEditable) {
                return this.switchCell(props);
            } else {
                return (
                    <EditableCellPublic
                        value={cellValue(props)}
                        setCellEdit={this.handleCellEditableChange}
                    />
                );
            }
        } else {
            return <EditableCellShow value={cellValue(props)} />;
        }
    };
    componentWillReceiveProps(nextProps) {
        if (!nextProps.editable) {
            this.setState({
                cellEditable: false
            });
        }
    }
    render() {
        return (
            <div className="table-editable-cell" ref="tableEditableCell">
                {this.renderCell(this.props)}
            </div>
        );
    }
}

export default EditableCell;

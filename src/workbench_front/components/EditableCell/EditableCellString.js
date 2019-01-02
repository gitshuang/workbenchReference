import React, { Component } from "react";
import { Input, Tooltip } from "antd";
import { cellNonempty } from "./Util";
import { langCheck } from 'Pub/js/utils';
/**
 * 表格编辑单元格 - String类型
 */
class EditableCellString extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            visible: false,
            cellErrorMsg: langCheck('0000PUB-000003')/* 国际化处理： 不能为空！*/
        };
    }
    /**
     * 值改变
     */
    handleChange = e => {
        let value = e.target.value;
        const { cellChange, cellKey, cellIndex, cellRequired } = this.props;
        if (cellRequired) {
            let flag = cellNonempty(value);
            this.setState({ hasError: flag });
        }
        cellChange(cellKey, cellIndex, value);
    };
    /**
     * 回车事件
     */
    handlePressEnter = () => {
        const {
            value,
            cellRequired,
            setCellEdit,
            cellCheck,
            cellKey,
            cellIndex
        } = this.props;
        if (cellRequired) {
            if (cellCheck) {
                let { cellErrorMsg, hasError } = cellCheck(
                    cellKey,
                    cellIndex,
                    value
                );
                if (cellErrorMsg) {
                    this.setState({ hasError, cellErrorMsg });
                } else {
                    this.setState({ hasError});
                }
                setCellEdit(hasError);
            } else {
                let flag = cellNonempty(value);
                this.setState({ hasError: flag });
                setCellEdit(flag);
            }
        } else {
            setCellEdit(false);
        }
    };
    /**
     * 鼠标移出事件
     */
    handleBlur = () => {
        const {
            value,
            cellRequired,
            setCellEdit,
            cellKey,
            cellIndex,
            cellCheck
        } = this.props;
        if (cellRequired) {
            if (cellCheck) {
                let { cellErrorMsg, hasError } = cellCheck(
                    cellKey,
                    cellIndex,
                    value
                );
                if (cellErrorMsg) {
                    this.setState({ hasError, cellErrorMsg });
                } else {
                    this.setState({ hasError});
                }
                setCellEdit(hasError);
            } else {
                let flag = cellNonempty(value);
                this.setState({ hasError: flag });
                setCellEdit(flag);
            }
        } else {
            setCellEdit(false);
        }
    };
    handleMouseOver = () => {
        this.setState({ visible: true });
    };
    handleMouseOut = () => {
        this.setState({ visible: false });
    };
    render() {
        let { value } = this.props;
        return (
            <div
                className={this.state.hasError ? "has-error" : ""}
                onMouseOut={this.handleMouseOut}
                onMouseOver={this.handleMouseOver}
            >
                <Tooltip
                    placement="top"
                    overlayClassName='tootip-white'
                    visible={this.state.hasError && this.state.visible}
                    title={this.state.cellErrorMsg}
                >
                    <Input
                        autoFocus={true}
                        value={value}
                        onChange={this.handleChange}
                        onPressEnter={this.handlePressEnter}
                        onBlur={this.handleBlur}
                    />
                </Tooltip>
            </div>
        );
    }
}
export default EditableCellString;

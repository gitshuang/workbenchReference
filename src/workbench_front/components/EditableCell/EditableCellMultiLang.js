import React, { Component } from "react";
import { base } from "nc-lightapp-front";
import { Tooltip } from "antd";
import { getCookie, langCheck } from "Pub/js/utils";
import { cellNonempty } from "./Util";
const MultiLangText = base.NCMultiLangText;
class EditableCellMultiLang extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            visible: false,
            cellErrorMsg: langCheck(
                "0000PUB-000003"
            ) /* 国际化处理： 不能为空！*/
        };
        // 当前语种
        this.locale = getCookie("langCode") || "simpchn";
        // 主要语种
        this.langMain = props.options.find(
            item => item.languageMain
        ).languageCode;
    }
    handleChange = value => {
        let {
            cellKey,
            cellMark,
            cellChange,
            cellRequired,
            cellIndex,
            setCellEdit,
            options
        } = this.props;
        if (cellRequired) {
            let mainIndex, localeIndex;
            options.map(item => {
                if (item.languageCode == this.langMain) {
                    mainIndex = item.index;
                }
                if (item.languageCode == this.locale) {
                    localeIndex = item.index;
                }
            });
            let flag = false;
            // 主要语种与当前语种都为空时才为空，如果主要语种不为空则不为空。如果主要语种为空，当前语种不为空，则当前语种赋值给主要语种
            if (cellNonempty(value[`${cellMark}${mainIndex}`].value)) {
                if (cellNonempty(value[`${cellMark}${localeIndex}`].value)) {
                    flag = true;
                } else {
                    value[`${cellMark}${mainIndex}`].value =
                        value[`${cellMark}${localeIndex}`].value;
                }
            }
            this.setState({ hasError: flag });
        }
        cellChange(cellKey, cellIndex, value);
        setCellEdit(true);
    };
    handleBlur = value => {
        let {
            cellKey,
            cellMark,
            cellChange,
            cellIndex,
            cellCheck,
            cellRequired,
            options,
            setCellEdit
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
                    this.setState({ hasError });
                }
                setCellEdit(hasError);
            } else {
                let mainIndex, localeIndex;
                options.map(item => {
                    if (item.languageCode == this.langMain) {
                        mainIndex = item.index;
                    }
                    if (item.languageCode == this.locale) {
                        localeIndex = item.index;
                    }
                });
                let flag = false;
                // 主要语种与当前语种都为空时才为空，如果主要语种不为空则不为空。如果主要语种为空，当前语种不为空，则当前语种赋值给主要语种
                if (cellNonempty(value[`${cellMark}${mainIndex}`].value)) {
                    if (
                        cellNonempty(value[`${cellMark}${localeIndex}`].value)
                    ) {
                        flag = true;
                    } else {
                        value[`${cellMark}${mainIndex}`].value =
                            value[`${cellMark}${localeIndex}`].value;
                    }
                }
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
        let { cellMark, value, options } = this.props;
        return (
            <div
                className={this.state.hasError ? "has-error" : ""}
                onMouseOut={this.handleMouseOut}
                onMouseOver={this.handleMouseOver}
            >
                <Tooltip
                    placement="top"
                    overlayClassName="tootip-white"
                    visible={this.state.hasError && this.state.visible}
                    title={this.state.cellErrorMsg}
                >
                    <MultiLangText
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        languageMeta={options}
                        attrcode={cellMark}
                        value={value}
                    />
                </Tooltip>
            </div>
        );
    }
}
export default EditableCellMultiLang;

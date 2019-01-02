import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Tabs, Button, Table, Input, Switch, Popconfirm, Modal } from "antd";
import { DragSource, DropTarget } from "react-dnd";
import withDragDropContext from "Pub/js/withDragDropContext";
import update from "immutability-helper";
import _ from "lodash";
import {
    setPageButtonData,
    setPageTemplateData,
    setPageActiveKey
} from "Store/AppRegister/action";
import EditableCell from "Components/EditableCell";
import CoverPosotion from "Components/CoverPosition";
import Ajax from "Pub/js/ajax";
import Notice from "Components/Notice";
import PreviewModal from "./showPreview";
import { openPage } from "Pub/js/superJump";
import { langCheck } from "Pub/js/utils";
const TabPane = Tabs.TabPane;
/**
 * 表格表头必输项渲染
 * @param {String} title
 */
const RenderTableTitle = title => (
    <span>
        <span style={{ color: "#e14c46" }}>*</span>
        <span>{title}</span>
    </span>
);
function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset
) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return "downward";
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return "upward";
    }
}
let BodyRow = props => {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        moveRow,
        dragRow,
        clientOffset,
        sourceClientOffset,
        initialClientOffset,
        ...restProps
    } = props;
    const style = { ...restProps.style, cursor: "move" };

    let className = restProps.className;
    if (isOver && initialClientOffset) {
        const direction = dragDirection(
            dragRow.index,
            restProps.index,
            initialClientOffset,
            clientOffset,
            sourceClientOffset
        );
        if (direction === "downward") {
            className += " drop-over-downward";
        }
        if (direction === "upward") {
            className += " drop-over-upward";
        }
    }

    return connectDragSource(
        connectDropTarget(
            <tr {...restProps} className={className} style={style} />
        )
    );
};
const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }
        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    }
};
const rowSource = {
    beginDrag(props) {
        return {
            index: props.index
        };
    }
};
BodyRow = DropTarget("row", rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset()
}))(
    DragSource("row", rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset()
    }))(BodyRow)
);
class PageTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            batchSettingModalVisibel: false,
            templetid: "",
            visible: false,
            templateCode: ""
        };
        /* 检验数组 */
        this.btnListCell = [
            {
                key: "btncode",
                name: langCheck(
                    "102202APP-000129",
                    "pages",
                    props.langJson
                ) /* 国际化处理： 按钮编码*/,
                required: true
            },
            {
                key: "btnname",
                name: langCheck(
                    "102202APP-000130",
                    "pages",
                    props.langJson
                ) /* 国际化处理： 按钮名称*/,
                required: false
            },
            {
                key: "parent_code",
                name: langCheck(
                    "102202APP-000132",
                    "pages",
                    props.langJson
                ) /* 国际化处理： 父按钮编码*/,
                required: false
            },
            {
                key: "btntype",
                name: langCheck(
                    "102202APP-000131",
                    "pages",
                    props.langJson
                ) /* 国际化处理： 按钮类型*/,
                required: true
            },
            {
                key: "btnarea",
                name: langCheck(
                    "102202APP-000133",
                    "pages",
                    props.langJson
                ) /* 国际化处理： 按钮区域,按钮区域*/,
                required: true
            },
            {
                key: "iskeyfunc",
                name: langCheck(
                    "102202APP-000134",
                    "pages",
                    props.langJson
                ) /* 国际化处理： 关键功能*/,
                required: false
            },
            {
                key: "btndesc",
                name: langCheck(
                    "102202APP-000135",
                    "pages",
                    props.langJson
                ) /* 国际化处理： 按钮功能描述*/,
                required: false
            }
        ];
        this.columnsSt = [
            {
                title: langCheck(
                    "102202APP-000059",
                    "pages",
                    props.langJson
                ) /* 国际化处理： 序号*/,
                dataIndex: "num",
                width: "5%"
            },
            {
                title: langCheck(
                    "102202APP-000114",
                    "pages",
                    props.langJson
                ) /* 国际化处理： 模板编码*/,
                dataIndex: "code",
                width: "25%"
            },
            {
                title: langCheck(
                    "102202APP-000115",
                    "pages",
                    props.langJson
                ) /* 国际化处理： 模板名称*/,
                dataIndex: "name",
                width: "15%"
            },
            {
                title: langCheck(
                    "102202APP-000047",
                    "pages",
                    props.langJson
                ) /* 国际化处理： 多语字段*/,
                dataIndex: "resid",
                width: "15%"
            },
            {
                title: langCheck(
                    "102202APP-000062",
                    "pages",
                    props.langJson
                ) /* 国际化处理： 操作*/,
                dataIndex: "operation",
                render: (text, record) => {
                    const { editable } = record;
                    return (
                        <div className="editable-row-operations">
                            {editable ? (
                                <span>
                                    <a
                                        className="margin-right-15"
                                        onClick={() => this.save(record)}
                                    >
                                        {langCheck(
                                            "102202APP-000069",
                                            "pages",
                                            props.langJson
                                        )}
                                        {/* 国际化处理： 保存*/}
                                    </a>
                                    <Popconfirm
                                        title={langCheck(
                                            "102202APP-000063",
                                            "pages",
                                            props.langJson
                                        )} /* 国际化处理： 确定取消?*/
                                        cancelText={langCheck(
                                            "102202APP-000064",
                                            "pages",
                                            props.langJson
                                        )} /* 国际化处理： 取消*/
                                        okText={langCheck(
                                            "102202APP-000065",
                                            "pages",
                                            props.langJson
                                        )} /* 国际化处理： 确定*/
                                        onConfirm={() => this.cancel(record)}
                                    >
                                        <a className="margin-right-15">
                                            {langCheck(
                                                "102202APP-000064",
                                                "pages",
                                                props.langJson
                                            )}
                                        </a>
                                        {/* 国际化处理： 取消*/}
                                    </Popconfirm>
                                </span>
                            ) : (
                                <span>
                                    <Popconfirm
                                        title={langCheck(
                                            "102202APP-000066",
                                            "pages",
                                            props.langJson
                                        )} /* 国际化处理： 确定删除?*/
                                        cancelText={langCheck(
                                            "102202APP-000064",
                                            "pages",
                                            props.langJson
                                        )} /* 国际化处理： 取消*/
                                        okText={langCheck(
                                            "102202APP-000065",
                                            "pages",
                                            props.langJson
                                        )} /* 国际化处理： 确定*/
                                        onConfirm={() => this.del(record)}
                                    >
                                        <a className="margin-right-15">
                                            {langCheck(
                                                "102202APP-000053",
                                                "pages",
                                                props.langJson
                                            )}
                                        </a>
                                        {/* 国际化处理： 删除*/}
                                    </Popconfirm>
                                    <a
                                        className="margin-right-15"
                                        onClick={() => this.jumpPage(record)}
                                    >
                                        {langCheck(
                                            "102202APP-000139",
                                            "pages",
                                            props.langJson
                                        )}
                                        {/* 国际化处理： 设置页面模板*/}
                                    </a>
                                    <a
                                        className="margin-right-15"
                                        onClick={() => {
                                            this.showModal(record);
                                        }}
                                    >
                                        {langCheck(
                                            "102202APP-000140",
                                            "pages",
                                            props.langJson
                                        )}
                                        {/* 国际化处理： 预览*/}
                                    </a>
                                    {record.isdefault ? null : (
                                        <a
                                            className="margin-right-15"
                                            onClick={() =>
                                                this.setDefault(record)
                                            }
                                        >
                                            {langCheck(
                                                "102202APP-000141",
                                                "pages",
                                                props.langJson
                                            )}
                                            {/* 国际化处理： 设为默认模板*/}
                                        </a>
                                    )}
                                </span>
                            )}
                        </div>
                    );
                }
            }
        ];
        this.cacheData;
    }
    components = {
        body: {
            row: BodyRow
        }
    };
    showModal = record => {
        this.setState({
            batchSettingModalVisibel: true,
            templetid: record.pk_page_templet
        });
    };
    setModalVisibel = visibel => {
        this.setState({ batchSettingModalVisibel: visibel });
    };
    jumpPage = record => {
        openPage(`/Zone`, false, {
            n: langCheck(
                "102202APP-000116",
                "pages",
                this.props.langJson
            ) /* 国际化处理： 页面模板设置*/,
            templetid: record.pk_page_templet
        });
    };
    /**
     * 设置默认模板
     */
    setDefault = record => {
        Ajax({
            url: `/nccloud/platform/templet/setdefaulttemplet.do`,
            info: {
                name: langCheck(
                    "102202APP-000074",
                    "pages",
                    this.props.langJson
                ) /* 国际化处理： 应用注册*/,
                action: langCheck(
                    "102202APP-000117",
                    "pages",
                    this.props.langJson
                ) /* 国际化处理： 设置默认模板*/
            },
            data: {
                appcode: record.appcode,
                pagecode: record.pagecode,
                templetid: record.pk_page_templet
            },
            success: ({ data: { data } }) => {
                if (data) {
                    let newPageTemplets = this.props.pageTemplets.map(item => {
                        item.isdefault = false;
                        if (item.pk_page_templet === record.pk_page_templet) {
                            item.isdefault = true;
                        }
                        return item;
                    });
                    this.props.setPageTemplateData(newPageTemplets);
                    Notice({ status: "success", msg: data });
                }
            }
        });
    };
    moveRow = (dragIndex, hoverIndex) => {
        let appButtonVOs = this.props.appButtonVOs;
        let target = appButtonVOs.find(item => item.editable === true);
        if (target) {
            return;
        }
        const dragRow = appButtonVOs[dragIndex];
        let sortData = update(appButtonVOs, {
            $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]
        });
        sortData.map((item, index) => (item.btnorder = index));
        Ajax({
            url: `/nccloud/platform/appregister/orderbuttons.do`,
            info: {
                name: langCheck(
                    "102202APP-000118",
                    "pages",
                    this.props.langJson
                ) /* 国际化处理： 页面按钮*/,
                action: langCheck(
                    "102202APP-000119",
                    "pages",
                    this.props.langJson
                ) /* 国际化处理： 排序*/
            },
            data: sortData,
            success: ({ data }) => {
                if (data.success && data.data) {
                    this.props.setPageButtonData(sortData);
                } else {
                    Notice({ status: "error", msg: data.data.true });
                }
            }
        });
    };
    /**
     * 按钮检查
     */
    handleBtnCheck = (key, index, value) => {
        let newData = this.getNewData();
        value = value ? value : "";
        if (value.length === 0) {
            newData[index]["hasError"] = true;
            this.setNewData(newData);
            return {
                hasError: true
            };
        } else {
            // 按钮编码字段不能重复
            if (key === "btncode") {
                let itemList = newData.filter(item => item[key] === value);
                if (itemList.length > 1) {
                    newData[index]["hasError"] = true;
                    this.setNewData(newData);
                    return {
                        hasError: true,
                        cellErrorMsg: langCheck(
                            "102202APP-000120",
                            "pages",
                            this.props.langJson
                        ) /* 国际化处理： 按钮编码不能重复*/
                    };
                }
            }
            newData[index]["hasError"] = false;
            this.setNewData(newData);
            return {
                hasError: false
            };
        }
    };
    /**
     * 单元格编辑校验
     */
    handleBtnCellChange = (key, index, value) => {
        let newData = this.getNewData();
        newData[index][key] = value;
        this.setNewData(newData);
    };
    handleChange = (value, record, column) => {
        let newData = this.getNewData();
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            target[column] = value;
            this.setNewData(newData);
        }
    };
    edit = record => {
        let newData = this.getNewData();
        const dataList = newData.filter(item => item.editable === true);
        if (dataList.length > 0) {
            Notice({
                status: "warning",
                msg: langCheck("102202APP-000051", "pages", this.props.langJson)
            }); /* 国际化处理： 请逐条修改按钮！*/
            return;
        }
        this.cacheData = _.cloneDeep(newData);
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            target.editable = true;
            this.setNewData(newData);
        }
    };
    del = record => {
        if (record.pk_btn || record.pk_page_templet) {
            let url, data, info;
            let activeKey = this.props.pageActiveKey;
            let newData = this.getNewData();
            if (activeKey === "1") {
                url = `/nccloud/platform/appregister/deletebutton.do`;
                data = {
                    pk_btn: record.pk_btn
                };
                info = {
                    name: langCheck(
                        "102202APP-000118",
                        "pages",
                        this.props.langJson
                    ) /* 国际化处理： 页面按钮*/,
                    action: langCheck(
                        "102202APP-000053",
                        "pages",
                        this.props.langJson
                    ) /* 国际化处理： 删除*/
                };
            } else if (activeKey === "2") {
                url = `/nccloud/platform/template/deleteTemplateDetail.do`;
                data = {
                    templateId: record.pk_page_templet
                };
                info = {
                    name: langCheck(
                        "102202APP-000121",
                        "pages",
                        this.props.langJson
                    ) /* 国际化处理： 页面模板*/,
                    action: langCheck(
                        "102202APP-000053",
                        "pages",
                        this.props.langJson
                    ) /* 国际化处理： 删除*/
                };
            }
            Ajax({
                url: url,
                info: info,
                data: data,
                success: ({ data }) => {
                    if (data.success && data.data) {
                        if (record.pk_btn) {
                            _.remove(
                                newData,
                                item => record.pk_btn === item.pk_btn
                            );
                        } else if (record.pk_page_templet) {
                            _.remove(
                                newData,
                                item =>
                                    record.pk_page_templet ===
                                    item.pk_page_templet
                            );
                        }
                        this.setNewData(newData);
                        this.cacheData = _.cloneDeep(newData);
                        Notice({ status: "success" });
                    } else {
                        Notice({ status: "error", msg: data.data.true });
                    }
                }
            });
        }
    };
    save = record => {
        let activeKey = this.props.pageActiveKey;
        let newData = this.getNewData();
        if (activeKey === "1") {
            // 判断字段必输项
            let enptyCell = this.btnListCell.filter(
                item =>
                    (item.required && !record[item.key]) ||
                    (item.required &&
                        record[item.key] &&
                        record[item.key].length === 0)
            );
            if (enptyCell.length > 0) {
                let enptyCellName = enptyCell.map(item => item.name);
                Notice({
                    status: "error",
                    msg: `${langCheck(
                        "102202APP-000054",
                        "pages",
                        this.props.langJson
                    )}${enptyCellName.toString()}`
                }); /* 国际化处理： 下列字段段不能为空：*/
                return;
            }
            // 判断按钮编码是否重复
            let arrayBtn = newData.filter(
                item => record.btncode === item.btncode
            );
            if (arrayBtn.length > 1) {
                Notice({
                    status: "error",
                    msg: langCheck(
                        "102202APP-000122",
                        "pages",
                        this.props.langJson
                    )
                }); /* 国际化处理： 按钮编码重复，请再次确认！*/
                return;
            }
        } else {
            let arrayTmp = newData.filter(item => record.code === item.code);
            if (arrayTmp.length > 1) {
                Notice({
                    status: "error",
                    msg: langCheck(
                        "102202APP-000123",
                        "pages",
                        this.props.langJson
                    )
                }); /* 国际化处理： 模板编码重复，请再次确认！*/
                return;
            }
        }
        let url, listData, info;
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            if (target.pk_btn || target.pk_page_templet) {
                if (activeKey === "1") {
                    url = `/nccloud/platform/appregister/editbutton.do`;
                    info = {
                        name: langCheck(
                            "102202APP-000118",
                            "pages",
                            this.props.langJson
                        ) /* 国际化处理： 页面按钮*/,
                        action: langCheck(
                            "102202APP-000055",
                            "pages",
                            this.props.langJson
                        ) /* 国际化处理： 编辑*/
                    };
                } else if (activeKey === "2") {
                    url = `/nccloud/platform/templet/edittemplet.do`;
                    info = {
                        name: langCheck(
                            "102202APP-000121",
                            "pages",
                            this.props.langJson
                        ) /* 国际化处理： 页面模板*/,
                        action: langCheck(
                            "102202APP-000055",
                            "pages",
                            this.props.langJson
                        ) /* 国际化处理： 编辑*/
                    };
                }
            } else {
                if (activeKey === "1") {
                    url = `/nccloud/platform/appregister/insertbutton.do`;
                    info = {
                        name: langCheck(
                            "102202APP-000118",
                            "pages",
                            this.props.langJson
                        ) /* 国际化处理： 页面按钮*/,
                        action: langCheck(
                            "102202APP-000056",
                            "pages",
                            this.props.langJson
                        ) /* 国际化处理： 新增*/
                    };
                } else if (activeKey === "2") {
                    url = `/nccloud/platform/templet/addtemplet.do`;
                    info = {
                        name: langCheck(
                            "102202APP-000121",
                            "pages",
                            this.props.langJson
                        ) /* 国际化处理： 页面模板*/,
                        action: langCheck(
                            "102202APP-000056",
                            "pages",
                            this.props.langJson
                        ) /* 国际化处理： 新增*/
                    };
                }
            }
            listData = {
                ...target
            };
            Ajax({
                url: url,
                info: info,
                data: listData,
                success: ({ data }) => {
                    if (data.success && data.data) {
                        delete target.editable;
                        if (listData.pk_btn || listData.pk_page_templet) {
                            newData.map((item, index) => {
                                if (
                                    listData.pk_btn === item.pk_btn ||
                                    listData.pk_page_templet ===
                                        item.pk_page_templet
                                ) {
                                    return { ...item, ...listData };
                                } else {
                                    return item;
                                }
                            });
                            this.setNewData(newData);
                        } else {
                            newData[newData.length - 1] = data.data;
                            this.setNewData(newData);
                        }
                        this.cacheData = _.cloneDeep(newData);
                        Notice({ status: "success" });
                    } else {
                        Notice({ status: "error", msg: data.data.true });
                    }
                }
            });
        }
    };
    cancel = record => {
        let newData = this.getNewData();
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            delete target.editable;
            this.setNewData(this.cacheData);
        }
    };
    add = () => {
        if (this.props.isNew || this.props.isEdit) {
            Notice({
                status: "warning",
                msg: langCheck("102202APP-000124", "pages", this.props.langJson)
            }); /* 国际化处理： 请先将页面进行保存！*/
            return;
        }
        let newData = this.getNewData();
        const target = newData.filter(item => item.editable === true);
        if (target.length > 0) {
            Notice({
                status: "warning",
                msg: langCheck("102202APP-000058", "pages", this.props.langJson)
            }); /* 国际化处理： 请逐条添加按钮！*/
            return;
        }
        this.cacheData = _.cloneDeep(newData);
        let activeKey = this.props.pageActiveKey;
        let { parentId, id, code } = this.props.nodeInfo;
        let parentcode = this.props.nodeData.parentcode;
        if (activeKey === "1") {
            newData.push({
                editable: true,
                btntype: "button_secondary",
                btncode: "",
                btnname: "",
                parent_code: "",
                btnarea: "",
                iskeyfunc: false,
                btndesc: "",
                appid: parentId,
                isenable: true,
                pagecode: code,
                btnorder: newData.length
            });
            this.setNewData(newData);
        } else if (activeKey === "2") {
            openPage(`/Zone`, false, {
                n: langCheck(
                    "102202APP-000116",
                    "pages",
                    this.props.langJson
                ) /* 国际化处理： 页面模板设置*/,
                pid: id,
                pcode: code,
                appcode: parentcode
            });
        }
    };
    getNewData() {
        let activeKey = this.props.pageActiveKey;
        let { appButtonVOs, pageTemplets } = this.props;
        if (activeKey === "1") {
            return _.cloneDeep(appButtonVOs);
        } else if (activeKey === "2") {
            return _.cloneDeep(pageTemplets);
        }
    }
    setNewData(newData) {
        let activeKey = this.props.pageActiveKey;
        if (activeKey === "1") {
            this.props.setPageButtonData(newData);
        } else if (activeKey === "2") {
            this.props.setPageTemplateData(newData);
        }
    }
    /**
     * 模态框确认
     */
    handleOk = e => {
        let { templateCode } = this.state;
        if (templateCode === "") {
            Notice({
                status: "warning",
                msg: langCheck("102202APP-000125", "pages", this.props.langJson)
            }); /* 国际化处理： 请填写模板编码！*/
            return;
        }
        let { id, code } = this.props.nodeInfo;
        let parentcode = this.props.nodeData.parentcode;
        Ajax({
            url: `/nccloud/platform/templet/addpagetemplate.do`,
            info: {
                name: langCheck(
                    "102202APP-000074",
                    "pages",
                    this.props.langJson
                ) /* 国际化处理： 应用注册*/,
                action: langCheck(
                    "102202APP-000126",
                    "pages",
                    this.props.langJson
                ) /* 国际化处理： 导入模板*/
            },
            data: {
                appcode: parentcode,
                pageid: id,
                code: templateCode,
                pagecode: code
            },
            success: ({ data: { success, data } }) => {
                if (success && data) {
                    Notice({
                        status: "success",
                        msg: langCheck(
                            "102202APP-000127",
                            "pages",
                            this.props.langJson
                        )
                    }); /* 国际化处理： 模板导入成功！*/
                    this.setState(
                        {
                            templateCode: "",
                            visible: false
                        },
                        () => {
                            this.getPageData(id);
                        }
                    );
                } else {
                    Notice({
                        status: "error",
                        msg: langCheck(
                            "102202APP-000128",
                            "pages",
                            this.props.langJson
                        )
                    }); /* 国际化处理： 模板导入失败！请重试！*/
                }
            }
        });
    };
    /**
     * 模态框取消
     */
    handleCancel = e => {
        this.setState({
            visible: false,
            templateCode: ""
        });
    };
    /**
     * 模板编码输入
     */
    handleTemplateCodeChange = e => {
        this.setState({
            templateCode: e.target.value
        });
    };
    /**
     * 获取页面数据
     */
    getPageData = key => {
        // 查询页面数据
        Ajax({
            url: `/nccloud/platform/appregister/querypagedetail.do`,
            info: {
                name: langCheck(
                    "102202APP-000072",
                    "pages",
                    this.props.langJson
                ) /* 国际化处理： 应用注册页面*/,
                action: langCheck(
                    "102202APP-000022",
                    "pages",
                    this.props.langJson
                ) /* 国际化处理： 查询*/
            },
            data: {
                pk_apppage: key
            },
            success: ({ data }) => {
                if (data.success && data.data) {
                    let { apppageVO, appButtonVOs, pageTemplets } = data.data;
                    this.props.setPageButtonData(appButtonVOs);
                    this.props.setPageTemplateData(pageTemplets);
                    this.props.setNodeData(apppageVO);
                }
            }
        });
    };

    /**
     * 创建按钮
     */
    creatAddLineBtn = () => {
        let activeKey = this.props.pageActiveKey;
        return (
            <div className="table-info-group">
                {activeKey === "1" ? (
                    <span className="info">
                        <i className="iconfont icon-tixing" />
                        {langCheck(
                            "102202APP-000142",
                            "pages",
                            this.props.langJson
                        )}
                        {/* 国际化处理： 请拖拽进行排序*/}
                    </span>
                ) : null}
                <Button
                    onClick={() => this.add()}
                    style={{ marginLeft: "8px" }}
                >
                    {langCheck(
                        "102202APP-000068",
                        "pages",
                        this.props.langJson
                    )}
                    {/* 国际化处理： 增行*/}
                </Button>
            </div>
        );
    };
    dataFun = () => {
        let { langJson } = this.props;
        const BTNTYPEOPTIONS = [
            {
                value: "button_main",
                text: langCheck(
                    "102202APP-000108",
                    "pages",
                    langJson
                ) /* 国际化处理： 主要按钮*/
            },
            {
                value: "button_secondary",
                text: langCheck(
                    "102202APP-000109",
                    "pages",
                    langJson
                ) /* 国际化处理： 次要按钮*/
            },
            {
                value: "buttongroup",
                text: langCheck(
                    "102202APP-000110",
                    "pages",
                    langJson
                ) /* 国际化处理： 按钮组*/
            },
            {
                value: "dropdown",
                text: langCheck(
                    "102202APP-000111",
                    "pages",
                    langJson
                ) /* 国际化处理： 下拉按钮*/
            },
            {
                value: "divider",
                text: langCheck(
                    "102202APP-000112",
                    "pages",
                    langJson
                ) /* 国际化处理： 分割下拉按钮*/
            },
            {
                value: "more",
                text: langCheck(
                    "102202APP-000113",
                    "pages",
                    langJson
                ) /* 国际化处理： 更多按钮*/
            }
        ];
        return BTNTYPEOPTIONS;
    };
    render() {
        let { appButtonVOs, pageTemplets } = this.props;
        let { batchSettingModalVisibel, templetid } = this.state;
        let btnflag = appButtonVOs.find(item => item.editable);
        let langJson = this.props.langJson;
        let columnsBtn = [
            {
                title: langCheck(
                    "102202APP-000059",
                    "pages",
                    langJson
                ) /* 国际化处理： 序号*/,
                dataIndex: "btnorder",
                width: "5%",
                render: text => text - 0 + 1
            },
            {
                title: btnflag
                    ? RenderTableTitle(
                          langCheck("102202APP-000129", "pages", langJson)
                      )
                    : langCheck(
                          "102202APP-000129",
                          "pages",
                          langJson
                      ) /* 国际化处理： 按钮编码,按钮编码*/,
                dataIndex: "btncode",
                width: "10%",
                render: (text, record, index) => (
                    <EditableCell
                        type={"string"}
                        value={text}
                        editable={record.editable}
                        cellIndex={index}
                        cellKey={"btncode"}
                        cellRequired={true}
                        cellChange={this.handleBtnCellChange}
                        cellCheck={this.handleBtnCheck}
                    />
                )
            },
            {
                title: langCheck(
                    "102202APP-000130",
                    "pages",
                    langJson
                ) /* 国际化处理： 按钮名称*/,
                dataIndex: "btnname",
                width: "10%",
                render: (text, record, index) => (
                    <EditableCell
                        type={"string"}
                        value={text}
                        editable={record.editable}
                        cellIndex={index}
                        cellKey={"btnname"}
                        cellRequired={false}
                        cellChange={this.handleBtnCellChange}
                        cellCheck={this.handleBtnCheck}
                    />
                )
            },
            {
                title: btnflag
                    ? RenderTableTitle(
                          langCheck("102202APP-000131", "pages", langJson)
                      )
                    : langCheck(
                          "102202APP-000131",
                          "pages",
                          langJson
                      ) /* 国际化处理： 按钮类型,按钮类型*/,
                dataIndex: "btntype",
                width: "15%",
                render: (text, record, index) => (
                    <EditableCell
                        type={"select"}
                        value={text}
                        editable={record.editable}
                        options={this.dataFun()}
                        cellIndex={index}
                        cellKey={"btntype"}
                        cellRequired={true}
                        cellChange={this.handleBtnCellChange}
                        cellCheck={this.handleBtnCheck}
                    />
                )
            },
            {
                title: langCheck(
                    "102202APP-000132",
                    "pages",
                    langJson
                ) /* 国际化处理： 父按钮编码*/,
                dataIndex: "parent_code",
                width: "10%",
                render: (text, record, index) => (
                    <EditableCell
                        type={"string"}
                        value={text}
                        editable={record.editable}
                        cellIndex={index}
                        cellKey={"parent_code"}
                        cellRequired={false}
                        cellChange={this.handleBtnCellChange}
                    />
                )
            },
            {
                title: btnflag
                    ? RenderTableTitle(
                          langCheck("102202APP-000133", "pages", langJson)
                      )
                    : langCheck(
                          "102202APP-000133",
                          "pages",
                          langJson
                      ) /* 国际化处理： 按钮区域,按钮区域*/,
                dataIndex: "btnarea",
                width: "10%",
                render: (text, record, index) => (
                    <EditableCell
                        type={"string"}
                        value={text}
                        editable={record.editable}
                        cellIndex={index}
                        cellKey={"btnarea"}
                        cellRequired={true}
                        cellChange={this.handleBtnCellChange}
                        cellCheck={this.handleBtnCheck}
                    />
                )
            },
            {
                title: btnflag
                    ? RenderTableTitle(
                          langCheck("102202APP-000134", "pages", langJson)
                      )
                    : langCheck(
                          "102202APP-000134",
                          "pages",
                          langJson
                      ) /* 国际化处理： 关键功能,关键功能*/,
                dataIndex: "iskeyfunc",
                width: "10%",
                render: (text, record, index) => (
                    <Switch
                        disabled={!record.editable}
                        onChange={checked => {
                            console.log(checked);
                            this.handleChange(checked, record, "iskeyfunc");
                        }}
                        checkedChildren={
                            <i className="iconfont icon-shenpitongguo" />
                        }
                        unCheckedChildren={
                            <i className="iconfont icon-shenpibohui" />
                        }
                        checked={text}
                    />
                )
            },
            {
                title: langCheck(
                    "102202APP-000135",
                    "pages",
                    langJson
                ) /* 国际化处理： 按钮功能描述*/,
                dataIndex: "btndesc",
                width: "15%",
                render: (text, record, index) => (
                    <EditableCell
                        type={"string"}
                        value={text}
                        editable={record.editable}
                        cellIndex={index}
                        cellKey={"btndesc"}
                        cellRequired={false}
                        cellChange={this.handleBtnCellChange}
                    />
                )
            },
            {
                title: langCheck(
                    "102202APP-000062",
                    "pages",
                    langJson
                ) /* 国际化处理： 操作*/,
                dataIndex: "operation",
                render: (text, record) => {
                    const { editable } = record;
                    return (
                        <div className="editable-row-operations">
                            {editable ? (
                                <span>
                                    <a
                                        className="margin-right-15"
                                        onClick={() => this.save(record)}
                                    >
                                        {langCheck(
                                            "102202APP-000069",
                                            "pages",
                                            langJson
                                        )}
                                        {/* 国际化处理： 保存*/}
                                    </a>
                                    <Popconfirm
                                        title={langCheck(
                                            "102202APP-000063",
                                            "pages",
                                            langJson
                                        )} /* 国际化处理： 确定取消?*/
                                        cancelText={langCheck(
                                            "102202APP-000064",
                                            "pages",
                                            langJson
                                        )} /* 国际化处理： 取消*/
                                        okText={langCheck(
                                            "102202APP-000065",
                                            "pages",
                                            langJson
                                        )} /* 国际化处理： 确定*/
                                        onConfirm={() => this.cancel(record)}
                                    >
                                        <a className="margin-right-15">
                                            {langCheck(
                                                "102202APP-000064",
                                                "pages",
                                                langJson
                                            )}
                                        </a>
                                        {/* 国际化处理： 取消*/}
                                    </Popconfirm>
                                </span>
                            ) : (
                                <span>
                                    <a
                                        className="margin-right-15"
                                        onClick={() => this.edit(record)}
                                    >
                                        {langCheck(
                                            "102202APP-000055",
                                            "pages",
                                            langJson
                                        )}
                                        {/* 国际化处理： 编辑*/}
                                    </a>
                                    <Popconfirm
                                        title={langCheck(
                                            "102202APP-000066",
                                            "pages",
                                            langJson
                                        )} /* 国际化处理： 确定删除?*/
                                        cancelText={langCheck(
                                            "102202APP-000064",
                                            "pages",
                                            langJson
                                        )} /* 国际化处理： 取消*/
                                        okText={langCheck(
                                            "102202APP-000065",
                                            "pages",
                                            langJson
                                        )} /* 国际化处理： 确定*/
                                        onConfirm={() => this.del(record)}
                                    >
                                        <a className="margin-right-15">
                                            {langCheck(
                                                "102202APP-000053",
                                                "pages",
                                                langJson
                                            )}
                                        </a>
                                        {/* 国际化处理： 删除*/}
                                    </Popconfirm>
                                </span>
                            )}
                        </div>
                    );
                }
            }
        ];
        return (
            <div>
                <Tabs
                    onChange={activeKey => {
                        this.props.setPageActiveKey(activeKey);
                    }}
                    activeKey={this.props.pageActiveKey}
                    tabBarExtraContent={this.creatAddLineBtn()}
                >
                    <TabPane
                        tab={langCheck("102202APP-000136", "pages", langJson)}
                        key="1"
                    >
                        {/* 国际化处理： 按钮注册*/}
                        <Table
                            bordered={false}
                            locale={{
                                emptyText: (
                                    <CoverPosotion type="treeCardTable" />
                                )
                            }}
                            pagination={false}
                            rowKey="btnorder"
                            components={this.components}
                            dataSource={appButtonVOs.map((item, index) => {
                                item.num = item.btnorder;
                                return item;
                            })}
                            onRow={(record, index) => ({
                                index,
                                moveRow: this.moveRow
                            })}
                            columns={columnsBtn}
                            size="middle"
                        />
                    </TabPane>
                    <TabPane
                        tab={langCheck("102202APP-000137", "pages", langJson)}
                        key="2"
                    >
                        {/* 国际化处理： 页面模板注册*/}
                        <Table
                            bordered={false}
                            locale={{
                                emptyText: (
                                    <CoverPosotion type="treeCardTable" />
                                )
                            }}
                            pagination={false}
                            rowKey="num"
                            dataSource={pageTemplets.map((item, index) => {
                                item.num = index + 1;
                                return item;
                            })}
                            columns={this.columnsSt}
                            size="middle"
                        />
                        <Modal
                            maskClosable={false}
                            closable={false}
                            title={langCheck(
                                "102202APP-000138",
                                "pages",
                                langJson
                            )} /* 国际化处理： 导入页面模板*/
                            okText={langCheck(
                                "102202APP-000065",
                                "pages",
                                langJson
                            )} /* 国际化处理： 确定*/
                            cancelText={langCheck(
                                "102202APP-000064",
                                "pages",
                                langJson
                            )} /* 国际化处理： 取消*/
                            wrapClassName="vertical-center-modal template-code-add"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                            <div className="template-item">
                                <label htmlFor="">
                                    {langCheck(
                                        "102202APP-000114",
                                        "pages",
                                        langJson
                                    )}
                                </label>
                                {/* 国际化处理： 模板编码*/}
                                <Input
                                    placeholder={langCheck(
                                        "102202APP-000114",
                                        "pages",
                                        langJson
                                    )} /* 国际化处理： 模板编码*/
                                    value={this.state.templateCode}
                                    onChange={this.handleTemplateCodeChange}
                                />
                            </div>
                            <div className="template-item">
                                <label htmlFor="">
                                    {langCheck(
                                        "102202APP-000103",
                                        "pages",
                                        langJson
                                    )}
                                </label>
                                {/* 国际化处理： 页面编码*/}
                                <span>{this.props.nodeInfo.code}</span>
                            </div>
                            <div className="template-item">
                                <label htmlFor="">
                                    {langCheck(
                                        "102202APP-000143",
                                        "pages",
                                        langJson
                                    )}
                                </label>
                                {/* 国际化处理： 页面主键*/}
                                <span>{this.props.nodeInfo.id}</span>
                            </div>
                        </Modal>
                    </TabPane>
                </Tabs>
                {batchSettingModalVisibel && (
                    <PreviewModal
                        templetid={templetid}
                        batchSettingModalVisibel={batchSettingModalVisibel}
                        setModalVisibel={this.setModalVisibel}
                        langJson={langJson}
                    />
                )}
            </div>
        );
    }
}
PageTable.propTypes = {
    isNew: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool.isRequired,
    nodeInfo: PropTypes.object.isRequired,
    nodeData: PropTypes.object.isRequired,
    appButtonVOs: PropTypes.array.isRequired,
    pageTemplets: PropTypes.array.isRequired,
    setPageTemplateData: PropTypes.func.isRequired,
    setPageButtonData: PropTypes.func.isRequired,
    setPageActiveKey: PropTypes.func.isRequired
};
let DragFromeTable = withDragDropContext(PageTable);
export default connect(
    state => {
        return {
            isNew: state.AppRegisterData.isNew,
            isEdit: state.AppRegisterData.isEdit,
            nodeData: state.AppRegisterData.nodeData,
            nodeInfo: state.AppRegisterData.nodeInfo,
            pageTemplets: state.AppRegisterData.pageTemplets,
            appButtonVOs: state.AppRegisterData.appButtonVOs,
            pageActiveKey: state.AppRegisterData.pageActiveKey,
            langJson: state.AppRegisterData.langJson
        };
    },
    { setPageButtonData, setPageTemplateData, setPageActiveKey }
)(withRouter(DragFromeTable));

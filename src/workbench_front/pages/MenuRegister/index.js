import React, { Component } from "react";
import { Button, Table, Switch, Popconfirm } from "antd";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import {
    updateMenuItemData,
    setModalVisible,
    setMenuId,
    updateLangMulti
} from "Store/MenuRegister/action";
import EditableCell from "Components/EditableCell";
import CoverPosotion from "Components/CoverPosition";
import Ajax from "Pub/js/ajax";
import { openPage } from "Pub/js/superJump";
import { PageScrollLayout, PageLayoutHeader } from "Components/PageLayout";
import CustomMenu from "./CustomMenu";
import Notice from "Components/Notice";
import { CancelPrompts } from "Components/EventPrompts";
import TableScroll from "Components/TableScroll";
import { getMulti } from "Pub/js/getMulti";
import { langCheck, getCookie } from "Pub/js/utils";
import "./index.less";
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
class MenuRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isedit: false,
            listData: [],
            // 是否为开发态
            isDevelopMode: false,
            boxHeight: 40,
            multiOptions: []
        };
        this.historyListData;
        // 当前语种
        this.locale = getCookie("langCode") || "simpchn";
    }
    /**
     * 表格单元格编辑事件
     */
    handleCellChange = (key, index, value) => {
        // console.log(key, index, value);
        const listData = [...this.state.listData];
        console.log(key, index, value);
        listData[index][key] = value;
        listData[index]["isModify"] = true;
        this.setState({
            listData
        });
    };
    /**
     * 菜单名非空校验
     */
    menuNameCheck = value => {
        let mainIndex, localeIndex;
        this.state.multiOptions.map(item => {
            if (item.languageMain) {
                mainIndex = item.index;
            }
            if (item.languageCode == this.locale) {
                localeIndex = item.index;
            }
        });
        let flag = false;
        let valMain = value[`menuname${mainIndex}`].value;
        let valLocale = value[`menuname${localeIndex}`].value;
        // 主要语种与当前语种都为空时才为空，如果主要语种不为空则不为空。如果主要语种为空，当前语种不为空，则当前语种赋值给主要语种
        if (!valMain || valMain.length === 0) {
            if (!valLocale || valLocale.length === 0) {
                flag = true;
            } else {
                value[`menuname${mainIndex}`].value = valLocale;
            }
        }
        return flag;
    };
    /**
     * 表格单元格校验
     */
    handleCellCheck = (key, index, value) => {
        let langMultiData = this.props.langMultiData;
        const listData = [...this.state.listData];
        if (key == "menunameVO") {
            let flag = this.menuNameCheck(value);
            listData[index]["hasError"] = flag;
            this.setState({
                listData
            });
            return {
                hasError: flag
            };
        }
        if (!value || value.length === 0) {
            listData[index]["hasError"] = true;
            this.setState({
                listData
            });
            return {
                hasError: true
            };
        } else {
            // 菜单编码不能重复
            if (key === "menucode") {
                let itemList = listData.filter(item => item[key] === value);
                if (itemList.length > 1) {
                    listData[index]["hasError"] = true;
                    this.setState({
                        listData
                    });
                    return {
                        hasError: true,
                        cellErrorMsg: langCheck(
                            "102202MENU-000003",
                            true,
                            langMultiData
                        ) /* 国际化处理： 菜单编码不能重复*/
                    };
                }
            }
            listData[index]["hasError"] = false;
            this.setState({
                listData
            });
            return {
                hasError: false
            };
        }
    };
    /**
     * 列表行操作事件
     */
    handleListClick = (key, record, index) => {
        let langMultiData = this.props.langMultiData;
        switch (key) {
            case "menuitem":
                this.props.updateMenuItemData(record);
                openPage("/mi", false, {
                    n: langCheck(
                        "102202MENU-000004",
                        true,
                        langMultiData
                    ) /* 国际化处理： 菜单注册*/,
                    id: record.pk_menu,
                    mn: record.menuname,
                    mt: record.isdefault && !this.state.isDevelopMode ? 1 : 0
                });
                break;
            case "del":
                if (record.isdefault) {
                    Notice({
                        status: "warning",
                        msg: langCheck(
                            "102202MENU-000005",
                            true,
                            langMultiData
                        ) /* 国际化处理： 系统预置的菜单不能删除！*/
                    });
                    return;
                }
                if (record.isenable) {
                    Notice({
                        status: "warning",
                        msg: langCheck(
                            "102202MENU-000006",
                            true,
                            langMultiData
                        ) /* 国际化处理： 已经启用的菜单不能删除！*/
                    });
                    return;
                }
                Ajax({
                    url: `/nccloud/platform/appregister/deleteappmenu.do`,
                    info: {
                        name: langCheck(
                            "102202MENU-000004",
                            true,
                            langMultiData
                        ) /* 国际化处理： 菜单注册*/,
                        action: langCheck(
                            "102202MENU-000007",
                            true,
                            langMultiData
                        ) /* 国际化处理： 删除菜单*/
                    },
                    data: {
                        pk_menu: record.pk_menu
                    },
                    success: res => {
                        let { data, success } = res.data;
                        if (success) {
                            let { listData } = this.state;
                            listData = listData.filter(
                                item => item.pk_menu !== record.pk_menu
                            );
                            this.setState({ listData });
                        }
                    }
                });
                break;
            case "copy":
                Ajax({
                    url: `/nccloud/platform/appregister/copyappmenu.do`,
                    info: {
                        name: langCheck(
                            "102202MENU-000004",
                            true,
                            langMultiData
                        ) /* 国际化处理： 菜单注册*/,
                        action: langCheck(
                            "102202MENU-000008",
                            true,
                            langMultiData
                        ) /* 国际化处理： 复制菜单*/
                    },
                    data: {
                        pk_menu: record.pk_menu
                    },
                    success: res => {
                        let { data, success } = res.data;
                        if (success) {
                            let { listData } = this.state;
                            listData.splice(index, 0, data);
                            this.setState({ listData });
                        }
                    }
                });
                break;
            case "custom":
                this.props.setMenuId(record.pk_menu);
                this.props.setModalVisible(true);
                break;
            default:
                break;
        }
    };
    /**
     * 菜单停起用
     * @param {Boole} checked 停启用状态
     * @param {Object} record 停启用状态
     */
    handleChange = (checked, record) => {
        let langMultiData = this.props.langMultiData;
        let { listData } = this.state;
        if (!checked) {
            Notice({
                status: "warning",
                msg: langCheck("102202MENU-000009", true, langMultiData)
            }); /* 国际化处理： 必须要有启用状态的菜单！*/
            return;
        }
        record.isenable = checked;
        Ajax({
            url: `/nccloud/platform/appregister/editappmenu.do`,
            info: {
                name: langCheck(
                    "102202MENU-000004",
                    true,
                    langMultiData
                ) /* 国际化处理： 菜单注册*/,
                action: langCheck(
                    "102202MENU-000010",
                    true,
                    langMultiData
                ) /* 国际化处理： 菜单停启用*/
            },
            data: [{ ...record }],
            success: res => {
                let { success, data } = res.data;
                if (success && data) {
                    listData = listData.map(item => {
                        if (data[0].pk_menu === item.pk_menu) {
                            return { ...data[0] };
                        } else {
                            item.isenable = false;
                            return item;
                        }
                    });
                    this.setState({ listData });
                }
            }
        });
    };
    /**
     * 表头操作按钮事件
     */
    handleBtnClick = key => {
        let langMultiData = this.props.langMultiData;
        switch (key) {
            case "save":
                let errorList = this.state.listData.filter(
                    item => item.hasError
                );
                if (errorList.length > 0) {
                    Notice({
                        status: "warning",
                        msg: langCheck(
                            "102202MENU-000011",
                            true,
                            langMultiData
                        ) /* 国际化处理： 请检查必输项！*/
                    });
                    return;
                }
                let modifyData = this.state.listData.filter(
                    item => item.isModify
                );
                Ajax({
                    url: `/nccloud/platform/appregister/editappmenu.do`,
                    data: modifyData,
                    info: {
                        name: langCheck(
                            "102202MENU-000004",
                            true,
                            langMultiData
                        ) /* 国际化处理： 菜单注册*/,
                        action: langCheck(
                            "102202MENU-000012",
                            true,
                            langMultiData
                        ) /* 国际化处理： 保存菜单*/
                    },
                    success: res => {
                        let { success, data } = res.data;
                        if (success && data) {
                            let listData = this.state.listData;
                            listData = listData.map(item => {
                                let newData = data.find(
                                    newItem => newItem.pk_menu === item.pk_menu
                                );
                                if (newData) {
                                    item = newData;
                                }
                                return item;
                            });
                            this.setState({ listData, isedit: false });
                            Notice({
                                status: "success",
                                msg: langCheck(
                                    "102202MENU-000013",
                                    true,
                                    langMultiData
                                ) /* 国际化处理： 保存成功！*/
                            });
                        } else {
                            Notice({
                                status: "error",
                                msg: data.data.true
                            });
                        }
                    }
                });
                break;
            case "edit":
                this.historyListData = _.cloneDeep(this.state.listData);
                this.setState({ isedit: true });
                break;
            case "cancle":
                CancelPrompts(() => {
                    this.setState({
                        listData: this.historyListData,
                        isedit: false
                    });
                });
                break;
            default:
                break;
        }
    };
    creatBtn = btnList => {
        return btnList.map((item, index) => {
            if (this.state.isedit) {
                if (item.isedit) {
                    return (
                        <Button
                            className="margin-left-10"
                            key={item.code}
                            type={item.type}
                            onClick={() => {
                                this.handleBtnClick(item.code);
                            }}
                        >
                            {item.name}
                        </Button>
                    );
                } else {
                    return null;
                }
            } else {
                if (item.isedit) {
                    return null;
                } else {
                    return (
                        <Button
                            className="margin-left-10"
                            key={item.code}
                            type={item.type}
                            onClick={() => {
                                this.handleBtnClick(item.code);
                            }}
                        >
                            {item.name}
                        </Button>
                    );
                }
            }
        });
    };
    /**
     * 设置自定义升级模态框关闭
     */
    modalClose = () => {
        this.setState({
            modalVisible: false
        });
    };
    /**
     * 查询启用语种
     */
    queryLanguage = () => {
        let langMultiData = this.props.langMultiData;
        console.log(langMultiData);
        Ajax({
            url: `/nccloud/platform/appregister/querylanguagevos.do`,
            info: {
                action: langCheck(
                    "102202MENU-000050",
                    true,
                    langMultiData
                ) /* 国际化处理： 查询启用语种*/,
                name: langCheck(
                    "102202MENU-000004",
                    true,
                    langMultiData
                ) /* 国际化处理： 菜单注册*/
            },
            success: ({ data: { data } }) => {
                if (data && data.length > 0) {
                    /**
                     * 前端组合成多语文本可以支持的options
                     */
                    let multiOptions = data.map((item, index) => {
                        let itemIndex = ++index;
                        let multiItem = {
                            index: "",
                            languageType: "zh",
                            languageCode: "simpchn"
                        };
                        multiItem.index =
                            itemIndex > 1 ? multiItem.index + itemIndex : "";
                        multiItem.languageType = item.locallang;
                        multiItem.languageCode = item.langcode;
                        multiItem.languageMain =
                            item.langseq == "1" ? true : false;
                        return multiItem;
                    });
                    // 现请求多语语种
                    this.setState({ multiOptions }, this.queryappmenus);
                }
            }
        });
    };
    /**
     * 菜单列表查询
     */
    queryappmenus = () => {
        let langMultiData = this.props.langMultiData;
        Ajax({
            url: `/nccloud/platform/appregister/queryappmenus.do`,
            info: {
                name: langCheck(
                    "102202MENU-000004",
                    true,
                    langMultiData
                ) /* 国际化处理： 菜单注册*/,
                action: langCheck(
                    "102202MENU-000014",
                    true,
                    langMultiData
                ) /* 国际化处理： 菜单列表查询*/
            },
            success: res => {
                let {
                    data: { appMenuVOs, isDevelopMode },
                    success
                } = res.data;
                if (success) {
                    this.setState({ listData: appMenuVOs, isDevelopMode });
                }
            }
        });
    };
    componentDidMount() {
        let langMultiData = this.props.langMultiData;
        if (!langMultiData["102202MENU-000000"]) {
            getMulti({
                moduleId: "102202MENU",
                // currentLocale: 'zh-CN',
                domainName: "workbench",
                callback: json => {
                    this.props.updateLangMulti(json);
                }
            });
        }
        this.queryLanguage();
        let boxHeight = document.getElementsByClassName(
            "menuregister-list-table"
        )[0].offsetHeight;
        this.setState({
            boxHeight
        });
    }

    render() {
        let { listData, isedit, multiOptions } = this.state;
        let langMultiData = this.props.langMultiData;
        this.columns = [
            {
                title: langCheck(
                    "102202MENU-000015",
                    true,
                    langMultiData
                ) /* 国际化处理： 序号*/,
                dataIndex: "num",
                key: "num",
                width: 60
            },
            {
                title: isedit
                    ? RenderTableTitle(
                          langCheck("102202MENU-000016", true, langMultiData)
                      )
                    : langCheck(
                          "102202MENU-000016",
                          true,
                          langMultiData
                      ) /* 国际化处理： 菜单编码,菜单编码*/,
                dataIndex: "menucode",
                key: "menucode",
                width: 150,
                render: (text, record, index) => (
                    <EditableCell
                        type={"string"}
                        value={text}
                        editable={this.state.isedit}
                        cellIndex={index}
                        cellKey={"menucode"}
                        cellRequired={true}
                        cellChange={this.handleCellChange}
                        cellCheck={this.handleCellCheck}
                    />
                )
            },
            {
                title: isedit
                    ? RenderTableTitle(
                          langCheck("102202MENU-000017", true, langMultiData)
                      )
                    : langCheck(
                          "102202MENU-000017",
                          true,
                          langMultiData
                      ) /* 国际化处理： 菜单名称,菜单名称*/,
                dataIndex: "menunameVO",
                key: "menunameVO",
                width: 150,
                render: (text, record, index) => (
                    <EditableCell
                        type={"multiString"}
                        value={text}
                        editable={this.state.isedit}
                        cellIndex={index}
                        cellKey={"menunameVO"}
                        cellMark={"menuname"}
                        cellRequired={true}
                        options={_.cloneDeep(multiOptions)}
                        cellChange={this.handleCellChange}
                        cellCheck={this.handleCellCheck}
                    />
                )
            },
            {
                title: langCheck(
                    "102202MENU-000018",
                    true,
                    langMultiData
                ) /* 国际化处理： 菜单描述*/,
                dataIndex: "menudescVO",
                key: "menudescVO",
                width: 100,
                render: (text, record, index) => {
                    return (
                        <EditableCell
                            type={"multiString"}
                            value={text}
                            editable={this.state.isedit}
                            cellIndex={index}
                            cellKey={"menudescVO"}
                            cellRequired={false}
                            cellMark={"menudesc"}
                            options={_.cloneDeep(multiOptions)}
                            cellChange={this.handleCellChange}
                        />
                    );
                }
            },
            {
                title: langCheck(
                    "102202MENU-000019",
                    true,
                    langMultiData
                ) /* 国际化处理： 启用*/,
                dataIndex: "isenable",
                key: "isenable",
                width: 110,
                render: (text, record, index) => (
                    <Switch
                        disabled={this.state.isedit}
                        onChange={checked => {
                            this.handleChange(checked, record);
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
                    "102202MENU-000020",
                    true,
                    langMultiData
                ) /* 国际化处理： 系统内置*/,
                dataIndex: "isdefault",
                key: "isdefault",
                width: 110,
                render: (text, record) => (
                    <Switch
                        disabled
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
                    "102202MENU-000021",
                    true,
                    langMultiData
                ) /* 国际化处理： 创建人*/,
                dataIndex: "creatorRef",
                key: "creatorRef",
                width: 150,
                render: (text, record) => {
                    if (text && text.refname) {
                        return text.refname;
                    }
                }
            },
            {
                title: langCheck(
                    "102202MENU-000022",
                    true,
                    langMultiData
                ) /* 国际化处理： 创建时间*/,
                dataIndex: "creationtime",
                key: "creationtime",
                width: 150
            },
            {
                title: langCheck(
                    "102202MENU-000023",
                    true,
                    langMultiData
                ) /* 国际化处理： 最后修改人*/,
                dataIndex: "modifierRef",
                key: "modifierRef",
                width: 150,
                render: (text, record) => {
                    if (text && text.refname) {
                        return text.refname;
                    }
                }
            },
            {
                title: langCheck(
                    "102202MENU-000024",
                    true,
                    langMultiData
                ) /* 国际化处理： 最后修改时间*/,
                dataIndex: "modifiedtime",
                key: "modifiedtime",
                width: 150
            }
        ];
        if (!isedit) {
            let options = {
                title: langCheck(
                    "102202MENU-000025",
                    true,
                    langMultiData
                ) /* 国际化处理： 操作*/,
                key: "action",
                width: 300,
                render: (text, record, index) => (
                    <div className="menuregister-list-action">
                        <span
                            onClick={() => {
                                this.handleListClick("copy", record, index);
                            }}
                        >
                            {langCheck(
                                "102202MENU-000028",
                                true,
                                langMultiData
                            ) /* 国际化处理： 复制*/}
                        </span>
                        {record.isdefault ? null : (
                            <Popconfirm
                                title={
                                    langCheck(
                                        "102202MENU-000026",
                                        true,
                                        langMultiData
                                    ) /* 国际化处理： 确定删除?*/
                                }
                                cancelText={langCheck(
                                    "102202MENU-000002",
                                    true,
                                    langMultiData
                                )} /* 国际化处理： 取消*/
                                okText={langCheck(
                                    "102202MENU-000027",
                                    true,
                                    langMultiData
                                )} /* 国际化处理： 确定*/
                                onConfirm={() => {
                                    this.handleListClick("del", record);
                                }}
                            >
                                <span>
                                    {langCheck(
                                        "102202MENU-000029",
                                        true,
                                        langMultiData
                                    ) /* 国际化处理： 删除*/}
                                </span>
                            </Popconfirm>
                        )}
                        <span
                            onClick={() => {
                                this.handleListClick("menuitem", record);
                            }}
                        >
                            {langCheck(
                                "102202MENU-000030",
                                true,
                                langMultiData
                            ) /* 国际化处理： 菜单项*/}
                        </span>
                        {record.isdefault ? null : (
                            <span
                                onClick={() => {
                                    this.handleListClick("custom", record);
                                }}
                            >
                                {langCheck(
                                    "102202MENU-000031",
                                    true,
                                    langMultiData
                                ) /* 国际化处理： 自定义菜单升级*/}
                            </span>
                        )}
                    </div>
                )
            };
            this.columns.push(options);
        }
        let btnList = [
            {
                name: langCheck(
                    "102202MENU-000000",
                    true,
                    langMultiData
                ) /* 国际化处理： 修改*/,
                code: "edit",
                type: "primary",
                isedit: false
            },
            {
                name: langCheck(
                    "102202MENU-000001",
                    true,
                    langMultiData
                ) /* 国际化处理： 保存*/,
                code: "save",
                type: "primary",
                isedit: true
            },
            {
                name: langCheck(
                    "102202MENU-000002",
                    true,
                    langMultiData
                ) /* 国际化处理： 取消*/,
                code: "cancle",
                type: "",
                isedit: true
            }
        ];
        return (
            <PageScrollLayout
                className="nc-workbench-menuregister"
                header={
                    <PageLayoutHeader>
                        <div>
                            {langCheck(
                                "102202MENU-000004",
                                true,
                                langMultiData
                            ) /* 国际化处理： 菜单注册*/}
                        </div>
                        <div>{this.creatBtn(btnList)}</div>
                    </PageLayoutHeader>
                }
            >
                <div className="menuregister-list">
                    <div className="menuregister-list-table">
                        <TableScroll
                            // bordered
                            locale={{
                                emptyText: <CoverPosotion />
                            }}
                            pagination={false}
                            size="middle"
                            rowKey={"pk_menu"}
                            columns={this.columns}
                            dataSource={listData.map((item, index) => {
                                item.num = index + 1;
                                return item;
                            })}
                            className="menuregister-table"
                        />
                    </div>
                    <CustomMenu langMultiData={langMultiData} />
                </div>
            </PageScrollLayout>
        );
    }
}
MenuRegister.propTypes = {
    updateMenuItemData: PropTypes.func.isRequired,
    setModalVisible: PropTypes.func.isRequired,
    setMenuId: PropTypes.func.isRequired,
    updateLangMulti: PropTypes.func.isRequired,
    langMultiData: PropTypes.object.isRequired
};
export default withRouter(
    connect(
        state => {
            return {
                langMultiData: state.menuRegisterData.langMultiData
            };
        },
        { updateMenuItemData, setModalVisible, setMenuId, updateLangMulti }
    )(MenuRegister)
);

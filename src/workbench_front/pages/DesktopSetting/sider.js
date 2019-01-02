import React, { Component } from 'react';
import _ from 'lodash';
import {
    Layout,
    Cascader,
    Input,
    Icon,
    Checkbox,
    Menu,
    Dropdown,
    Button
} from 'antd';
import SiderCard from './siderCard.js';
import { connect } from 'react-redux';
import NoResultImg from 'Assets/images/no-search-result.jpg';
import PleaseSeach from 'Assets/images/secrchGroup.png';
import Ajax from 'Pub/js/ajax';
const { Sider } = Layout;
const Search = Input.Search;
import Notice from 'Components/Notice';

class MySider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearch: false,
            searchValue: '',
            appGroupArr: [],
            modalVisible: false,
            isAllShow: true,
            domainModuleSelect: []
        };
    }
    componentDidMount() {
        const relateidObj = this.props.relateidObj;

        let ajaxData = {};
        if (relateidObj.type === 'userID') {
            ajaxData = {};
        } else if (relateidObj.type === 'is_group') {
            ajaxData = { is_group: relateidObj.data };
        } else {
            ajaxData = { pk_responsibility: relateidObj.data };
        }
        Ajax({
            url: `/nccloud/platform/appregister/queryapplazy.do`,
            info: {
                name: this.props.json['DesktopSetting-000004'],/* 国际化处理： 工作桌面配置*/
                action: this.props.json['DesktopSetting-000027']/* 国际化处理： 查询一二级领域模块*/
            },
            data: ajaxData,
            success: res => {
                if (res) {
                    let { data, success } = res.data;
                    if (success && data && data.length > 0) {
                        const domainModuleSelect = [
                            data[0].value,
                            data[0].children[0].value
                        ];
                        this.onCascaderChange(domainModuleSelect);
                        this.setState({
                            domainArr: data,
                            domainModuleSelect: domainModuleSelect
                        });
                    } else {
                        if (data.length === 0) {
                            Notice({
                                status: 'warning',
                                msg: this.props.json['DesktopSetting-000028']/* 国际化处理： 领域模块数据为空*/
                            });
                        } else {
                            Notice({ status: 'error', msg: data });
                        }
                    }
                }
            }
        });
    }
    updateAppGroupArr = appGroupArr => {
        this.setState({ appGroupArr: appGroupArr });
    };
    showModalVisible = () => {
        this.setModalVisible(true);
    };
    setModalVisible = modalVisible => {
        this.setState({ modalVisible });
    };
    //搜索框文本改变
    onInputChange = e => {
        let _serachText = e.target.value;
        this.state.searchValue = _serachText;
        this.setState({ searchValue: _serachText });
    };
    /**
     * 查询框删除按钮
     */
    handleSearchDel = () => {
        this.setState({ searchValue: "" });
    };
    //应用名模糊搜索
    onInputSearch = () => {
        if (this.state.searchValue === '') {
            return;
        }
        const relateidObj = this.props.relateidObj;
        let ajaxData = {};
        if (relateidObj.type === 'userID') {
            ajaxData = { search_content: this.state.searchValue };
        } else if (relateidObj.type === 'is_group') {
            ajaxData = {
                search_content: this.state.searchValue,
                is_group: relateidObj.data
            };
        } else {
            ajaxData = {
                search_content: this.state.searchValue,
                pk_responsibility: relateidObj.data
            };
        }

        Ajax({
            url: `/nccloud/platform/appregister/searchmenuitem.do`,
            info: {
                name: this.props.json['DesktopSetting-000004'],/* 国际化处理： 工作桌面配置*/
                action: this.props.json['DesktopSetting-000029']/* 国际化处理： 模糊搜索应用和部件*/
            },
            data: ajaxData,
            success: res => {
                const { data, success } = res.data;
                if (
                    success &&
                    data &&
                    data.children &&
                    data.children.length > 0
                ) {
                    data.isShow = true;
                    data.checkedAll = false;
                    data.indeterminate = false;
                    _.forEach(data.children, c => {
                        c.checked = false;
                        c.height = Number(c.height);
                        c.width = Number(c.width);
                    });
                    this.setState({ appGroupArr: [data], isAllShow: true });
                } else {
                    if (data && data.children && data.children.length === 0) {
                        this.setState({ appGroupArr: [], isAllShow: true });
                    } else {
                        Notice({ status: 'error', msg: data });
                    }
                }
            }
        });
    };
    //领域模块搜索
    onCascaderChange = value => {
        if (value && value.length === 0) {
            return;
        }
        let cascaderValueArr = value;
        if (cascaderValueArr.length === 1) {
            return;
        }
        const relateidObj = this.props.relateidObj;
        const ownModuleID = cascaderValueArr[1];

        let ajaxData = {};
        if (relateidObj.type === 'userID') {
            ajaxData = { own_module: ownModuleID };
        } else if (relateidObj.type === 'is_group') {
            ajaxData = { own_module: ownModuleID, is_group: relateidObj.data };
        } else {
            ajaxData = {
                own_module: ownModuleID,
                pk_responsibility: relateidObj.data
            };
        }

        Ajax({
            url: `/nccloud/platform/appregister/queryapplazy.do`,
            info: {
                name: this.props.json['DesktopSetting-000004'],/* 国际化处理： 工作桌面配置*/
                action: this.props.json['DesktopSetting-000030']/* 国际化处理： 查询模块下应用和部件*/
            },
            data: ajaxData,
            success: res => {
                const { data, success } = res.data;
                if (success && data && data.length > 0) {
                    _.forEach(data, d => {
                        d.isShow = true;
                        d.checkedAll = false;
                        d.indeterminate = false;
                        _.forEach(d.children, c => {
                            c.checked = false;
                            c.height = Number(c.height);
                            c.width = Number(c.width);
                        });
                    });
                    this.setState({
                        appGroupArr: data,
                        isAllShow: true,
                        domainModuleSelect: value
                    });
                } else {
                    if (data && data.length === 0) {
                        this.setState({
                            appGroupArr: [],
                            isAllShow: true,
                            domainModuleSelect: value
                        });
                    } else {
                        Notice({ status: 'error', msg: data });
                    }
                }
            }
        });
    };
    //切换搜索状态
    switchSearch = () => {
        const { showSearch } = this.state;
        this.setState({ showSearch: !showSearch }, () => {
            if (this.state.showSearch) {
                this.refs.searchInput.focus();
                this.setState({ appGroupArr: [], isAllShow: true });
            } else {
                this.onCascaderChange(this.state.domainModuleSelect);
            }
        });
    };
    //获取sider上方的搜索框
    getSearchDom() {
        let itemDom;
        if (this.state.showSearch) {
            itemDom = (
                <div className="sider-search fixed-search-input" >
                    <Search
                        ref="searchInput"
                        placeholder={this.props.json['DesktopSetting-000031']}/* 国际化处理： 请输入应用名称，回车搜索*/
                        style={{ width: '310px' }}
                        onChange={this.onInputChange}
                        onSearch={this.onInputSearch}
                        value={this.state.searchValue}
                        suffix={
                            this.state.searchValue.length > 0
                            ?
                            (<span className='fixed-search-icon-group'>
                                <i
                                    className="iconfont icon-qingkong"
                                    onClick={this.handleSearchDel}
                                />
                            </span>)
                            : null
                        }
                        className={
                            this.state.searchValue.length > 0
                            ? 'sider-search-color'
                            : ''
                        }
                    />
                    <span
                        className="switch-search-cancel"
                        onClick={this.switchSearch}
                    >
                        {this.props.json['DesktopSetting-000009']}
                        {/* /* 国际化处理： 取消*/ }
                    </span>
                </div>
            );
        } else {
            itemDom = (
                <div className="sider-search">
                    <Cascader
                        className="search-cascader"
                        style={{ width: '310px' }}
                        allowClear={false}
                        defaultValue={this.state.defaultValue}
                        value={this.state.domainModuleSelect}
                        options={this.state.domainArr}
                        onChange={this.onCascaderChange}
                        placeholder={this.props.json['DesktopSetting-000032']}/* 国际化处理： 请选择领域-模块*/
                        expandTrigger="hover"
                        popupClassName="desk-setting-cascader-popup"
                    />
                    {/* <span className="switch-search" onClick={this.switchSearch}>
                        <Icon type="search" title="切换至名称搜索" />
                    </span> */}
                    <span
                        className="switch-search"
                    >
                        <i
                            title={this.props.json['DesktopSetting-000033']}/* 国际化处理： 切换至名称搜索*/
                            className="iconfont icon-sousuo left-icon-sousuo"
                            onClick={this.switchSearch}
                        />
                    </span>
                </div>
            );
        }
        return itemDom;
    }
    //搜索结果
    getResultDom() {
        if (this.state.appGroupArr.length > 0) {
            return this.state.appGroupArr.map((item, index) => {
                return (
                    <div className="result-group-list" key={index}>
                    {
                        //当类型为'搜索结果'时不显示展开和收起
                        item.label === this.props.json['DesktopSetting-000034']/* 国际化处理： 搜索结果*/
                        ? ''
                        :
                        <h4 className="result-header">
                            <Checkbox
                                checked={item.checkedAll}
                                indeterminate={item.indeterminate}
                                onChange={e => {
                                    this.onCheckAllChange(e, index);
                                }}
                            />
                            <strong>
                                <span
                                    className="result-header-name"
                                    onClick={() => {
                                        this.onChangeShowHide(index);
                                    }}
                                >
                                    &nbsp;
                                    {item.label}
                                    &nbsp;
                                    {item.isShow ? (
                                        <Icon type="down" />
                                    ) : (
                                        <Icon type="right" />
                                    )}
                                </span>
                            </strong>
                        </h4>
                    }
                        <div
                            className="result-app-list"
                            style={{ display: item.isShow ? 'flex' : 'none' }}
                        >
                            {item.children.map((child, i) => {
                                return (
                                    <div className="app-col" key={i}>
                                        <div className="list-item">
                                            <SiderCard
                                                id={child.value}
                                                key={child.value}
                                                width={child.width}
                                                height={child.height}
                                                index={i}
                                                parentIndex={index}
                                                name={child.label}
                                                appGroupArr={
                                                    this.state.appGroupArr
                                                }
                                                checked={child.checked}
                                                onChangeChecked={
                                                    this.onChangeChecked
                                                }
                                                updateAppGroupArr={
                                                    this.updateAppGroupArr
                                                }
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            });
        } else {
            return (
                <div className="result-group-list">
                    <div className="no-result">
                        {/* <img src={NoResultImg} alt="无匹配结果" /> */}
                        <img src={PleaseSeach} alt={this.props.json['DesktopSetting-000035']} width='100'/>
                        {/* /* 国际化处理： 无匹配结果*/ }
                        <br/>
                    </div>
                    <div className='no-result-character'>{this.props.json['DesktopSetting-000042']}</div>
                    {/* /* 国际化处理： 未查询到相关数据*/ }
                </div>
            );
        }
    }

    //所有结果展开/收缩显示
    allShowOrHide = value => {
        let { appGroupArr, isAllShow } = this.state;
        _.forEach(appGroupArr, a => {
            a.isShow = value;
        });
        this.setState({ appGroupArr, isAllShow: value });
    };
    //单个结果展开/收缩展示
    onChangeShowHide(index) {
        let { appGroupArr } = this.state;
        appGroupArr[index].isShow = !appGroupArr[index].isShow;
        this.setState({
            appGroupArr
        });
    }
    //每组的全选与否
    onCheckAllChange = (e, index) => {
        const checked = e.target.checked;
        let { appGroupArr } = this.state;
        let selectGroup = appGroupArr[index];

        selectGroup.checkedAll = e.target.checked;
        selectGroup.indeterminate = false;
        _.forEach(selectGroup.children, c => {
            c.checked = checked;
        });
        this.setState({ appGroupArr });
    };
    //单个卡片的选择
    onChangeChecked = (checked, groupIndex, index) => {
        let { appGroupArr } = this.state;
        let selectGroup = appGroupArr[groupIndex];
        let child = selectGroup.children[index];
        child.checked = checked;

        let checkCount = 0;
        _.forEach(selectGroup.children, c => {
            if (c.checked) {
                checkCount++;
            }
        });

        selectGroup.checkedAll = checkCount === selectGroup.children.length;
        selectGroup.indeterminate =
            !!checkCount && checkCount < selectGroup.children.length;
        this.setState({ appGroupArr });
    };
    //sider中有checked的卡片
    hasChechedItem() {
        let flag = false;
        let { appGroupArr } = this.state;
        _.forEach(appGroupArr, s => {
            _.forEach(s.children, c => {
                if (c.checked) {
                    flag = true;
                    return false;
                }
            });
            if (flag) {
                return false;
            }
        });
        return flag;
    }
    allShowOrHideMenu = () => {
        return (
            <Menu>
                <Menu.Item
                    key="0"
                    className='all_expand'
                >
                    <Button
                        onClick={() => {
                            this.allShowOrHide(true);
                        }}
                        style={
                            !this.state.isAllShow
                                ? { cursor: 'pointer', fontWeight: 'bold' }
                                : { cursor: 'not-allowed' }
                        }
                        disabled={
                            this.state.isAllShow
                                ? { disabled: 'disabled' }
                                : null
                        }
                    >
                        {this.props.json['DesktopSetting-000036']}
                        {/* /* 国际化处理： 全部展开*/ }
                    </Button>
                </Menu.Item>
                <Menu.Item key="1">
                    <Button
                        onClick={() => {
                            this.allShowOrHide(false);
                        }}
                        style={
                            this.state.isAllShow
                                ? { cursor: 'pointer', fontWeight: 'bold' }
                                : { cursor: 'not-allowed' }
                        }
                        disabled={
                            !this.state.isAllShow
                                ? { disabled: 'disabled' }
                                : null
                        }
                    >
                        {this.props.json['DesktopSetting-000037']}
                        {/* /* 国际化处理： 全部收起*/ }
                    </Button>
                </Menu.Item>
            </Menu>
        );
    };
    render() {
        const contentHeight = this.props.contentHeight;
        const isDisabled = this.state.isAllShow;
        //搜索结果无展开，收起
        let searchResult = '';
        const { appGroupArr } = this.state;
        appGroupArr.map((val, idx) => {
            searchResult = val.label;
        })
        return (
            <Sider
                className="nc-workbench-home-sider"
                width={380}
                style={{ height: contentHeight }}
            >
                <div className="sider-content sider-content-height">
                    {this.getSearchDom()}
                    <div className="add-item">
                        <span>{this.props.json['DesktopSetting-000038']}</span>
                        {/* /* 国际化处理： *提示 : 请选择下方应用拖拽至右侧*/ }
                        {
                            searchResult === this.props.json['DesktopSetting-000034']/* 国际化处理： 搜索结果*/
                            ? ''
                            :
                            <Dropdown
                                trigger={['hover']}
                                placement="bottomCenter"
                                overlay={ this.allShowOrHideMenu() }
                            >
                                <Icon type="menu-unfold" />
                            </Dropdown>
                        }

                    </div>
                    <div className="sider-result">{this.getResultDom()}</div>
                </div>
            </Sider>
        );
    }
}
export default connect(
    state => ({
        json: state.templateDragData.json
    }),
    {}
)(MySider);

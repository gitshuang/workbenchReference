import React, { Component } from 'react';
import { Button, Popconfirm, Modal } from 'antd';
import { connect } from 'react-redux';
import Ajax from 'Pub/js/ajax';
import Notice from 'Components/Notice';
import { withRouter } from 'react-router-dom';
import PreviewModal from './showPreview';
import { GetQuery, langCheck } from 'Pub/js/utils';
import { openPage } from 'Pub/js/superJump';
import { ControlTip } from 'Components/ControlTip';
const confirm = Modal.confirm;
//header组件类
class MyHeader extends Component {
    constructor(props) {
        super(props);
        this.state = { previewVisibel: false };
    }
    //预览模态框是否显示
    setModalVisibel = (visibel) => {
        this.setState({ previewVisibel: visibel });
    };
    //点击保存
    saveData = () => {
        let configRefer = true;
        const { areaList, templetid, pcode, appcode, json } = this.props;
        //配置参照,参照名称不能为空
        _.forEach(areaList, (al, idx) => {
            if (al.areatype === '0') {
                //只对参照类型做判断
                _.forEach(al.queryPropertyList, (daty, kk) => {
                    if (
                        daty.datatype === '204' &&
                        (daty.refname === '-99' ||
                            daty.refname === '' ||
                            daty.refname === null ||
                            daty.refname === undefined)
                    ) {
                        Notice({
                            status: 'typeError',
                            msg: `${langCheck('ZoneSetting-000046', 'pages', json)} "${al.name}" ${langCheck('ZoneSetting-000047', 'pages', json)} "${daty.label}" ${langCheck('ZoneSetting-000048', 'pages', json)} "${langCheck('ZoneSetting-000030', 'pages', json)}" ${langCheck('ZoneSetting-000049', 'pages', json)}，${langCheck('ZoneSetting-000050', 'pages', json)}。`/* 国际化处理： 区域,下的,的,参照名称,字段属性未正确设置,请检查配置*/
                        });
                        configRefer = false;
                    }
                });
            }
            //非查询区占用列数不能为负数
            if (al.areatype == '1') {
                _.forEach(al.queryPropertyList, (colvalue, key) => {
                    if (colvalue.colnum < 0) {//占用列数属性字段不能为负数
                        Notice({
                            status: 'typeError',
                            msg: `${langCheck('ZoneSetting-000046', 'pages', json)} "${al.name}" ${langCheck('ZoneSetting-000047', 'pages', json)} "${colvalue.label}" ${langCheck('ZoneSetting-000048', 'pages', json)} "${langCheck('ZoneSetting-000031', 'pages', json)}" ${langCheck('ZoneSetting-000051', 'pages', json)}，${langCheck('ZoneSetting-000050', 'pages', json)}。`/* 国际化处理： 区域,下的,的,占用列数,字段属性不能为负数,请检查配置*/
                        });
                        configRefer = false;
                    }
                });
            }
            //模板设置下的‘最大长度’属性的长度不能为负数,添加验证
            _.forEach(al.queryPropertyList, (val, kk) => {
                if (val.maxlength < 0) {
                    Notice({
                        status: 'typeError',
                        msg: `${langCheck('ZoneSetting-000046', 'pages', json)} "${al.name}" ${langCheck('ZoneSetting-000047', 'pages', json)} "${val.label}" ${langCheck('ZoneSetting-000048', 'pages', json)} "${langCheck('ZoneSetting-000032', 'pages', json)}" ${langCheck('ZoneSetting-000051', 'pages', json)}，${langCheck('ZoneSetting-000050', 'pages', json)}。`/* 国际化处理： 区域,下的,的,最大长度,字段属性不能为负数,请检查配置*/
                    });
                    configRefer = false;
                }
            });
            //
        });
        if (!configRefer) {
            return false;
        }
        let formPropertyList = [];
        let queryPropertyList = [];
        //将pk_query_property置为空；
        _.forEach(areaList, (a, index) => {
            _.forEach(a.queryPropertyList, (q) => {
                if (q.pk_query_property.indexOf('new') !== -1) {
                    q.pk_query_property = '';
                }
            });
        });
        //将queryPropertyList按照区域的类型进行form和query分类
        _.forEach(areaList, (a, index) => {
            if (a.areatype === '0') {
                queryPropertyList = queryPropertyList.concat(a.queryPropertyList);
            } else {
                formPropertyList = formPropertyList.concat(a.queryPropertyList);
            }
        });

        const saveData = {};
        saveData.templetid = templetid;
        saveData.formPropertyList = formPropertyList;
        saveData.queryPropertyList = queryPropertyList;
        //保存请求
        Ajax({
            url: `/nccloud/platform/templet/setareaproperty.do`,
            info: {
                name: langCheck('ZoneSetting-000017', 'pages', json),/* 国际化处理： 单据模板设置*/
                action: langCheck('ZoneSetting-000033', 'pages', json)/* 国际化处理： 保存区域与属性*/
            },
            data: saveData,
            loading: true,//发送保存请求时页面显示loading
            success: (res) => {
                let param = GetQuery(this.props.location.search);
                const { data, success } = res.data;
                if (success) {
                    Notice({ status: 'success', msg: data });
                    //保存成功后需要清除localstorage本地缓存appcode_pcode
                    console.log('appcode=====', appcode);
                    console.log('pcode=====', pcode);
                    console.log('拼接=====', `appTempletStorage_${appcode}_${pcode}`);/* 国际化处理： 拼接=====*/
                    localStorage.removeItem(`appTempletStorage_${appcode}_${pcode}`);
                    if (this.props.status) {
                        // 实施态
                        if (this.props.status === 'templateSetting') {
                            openPage(`/TemplateSetting`, false, {}, [ 'status', 'templetid' ]);
                        } else if (this.props.status === 'templateSetting-unit') {
                            openPage(`/TemplateSetting-unit`, false, {}, [ 'status', 'templetid' ]);
                        }
                    } else {
                        // 开发态
                        openPage(`/ZoneSettingComplete`, false, {
                            templetid: this.props.templetid,
                            pcode: param.pcode,
                            pid: param.pid,
                            appcode: param.appcode
                        });
                    }
                } else {
                    Notice({ status: 'error', msg: data });
                }
            }
        });
    };
    render() {
        let { previewVisibel } = this.state;
        let { json } = this.props;
        return (
            <div className='template-setting-header'>
                <div className='header-name'>
                    <span>{langCheck('ZoneSetting-000035', 'pages', json)}</span>
                    {/* /* 国际化处理： 配置模板区域*/ }
                </div>
                <div className='button-list'>
                    {(() => {
                        // 开发态
                        if (!this.props.status) {
                            return (
                                // <Popconfirm
                                //     title="确定返回上一个页面吗？"
                                //     onConfirm={() => {
                                //         let param = GetQuery(
                                //             this.props.location.search
                                //         );
                                //         openPage(
                                //             `/Zone`,
                                //             false,
                                //             {
                                //                 templetid: this.props.templetid,
                                //                 pcode: param.pcode,
                                //                 pid: param.pid,
                                //                 appcode: param.appcode
                                //             },
                                //             ["appcode", "pcode", "pid"]
                                //         );
                                //     }}
                                //     placement="top"
                                //     okText="确定"
                                //     cancelText="取消"
                                // >
                                //     <Button>上一步</Button>
                                // </Popconfirm>
                                <Button
                                    onClick={() => {
                                        // confirm({
                                        //     title: '确定返回上一个页面吗？',
                                        //     okText: '确定',
                                        //     okType: 'danger',
                                        //     cancelText: '取消',
                                        //     mask: false,
                                        //     maskClosable: true,
                                        //     onOk:() => {
                                        //         let param = GetQuery(
                                        //             this.props.location.search
                                        //         );
                                        //         openPage(
                                        //             `/Zone`,
                                        //             false,
                                        //             {
                                        //                 templetid: this.props.templetid,
                                        //                 pcode: param.pcode,
                                        //                 pid: param.pid,
                                        //                 appcode: param.appcode
                                        //             },
                                        //             ["appcode", "pcode", "pid"]
                                        //         );
                                        //     },
                                        //     onCancel() {}
                                        // })
                                        //修改弹窗样式
                                        ControlTip({
                                            status: 'warning',
                                            title: langCheck('ZoneSetting-000036', 'pages', json),/* 国际化处理： 上一步*/
                                            msg: langCheck('ZoneSetting-000037', 'pages', json),/* 国际化处理： 确定返回上一个页面吗？*/
                                            onOk: () => {
                                                let param = GetQuery(this.props.location.search);
                                                openPage(
                                                    `/Zone`,
                                                    false,
                                                    {
                                                        templetid: this.props.templetid,
                                                        pcode: param.pcode,
                                                        pid: param.pid,
                                                        appcode: param.appcode
                                                    },
                                                    [ 'appcode', 'pcode', 'pid' ]
                                                );
                                            }
                                        });
                                    }}
                                >
                                    {langCheck('ZoneSetting-000036', 'pages', json)}
                                    {/* /* 国际化处理： 上一步*/}
                                </Button>
                            );
                        }
                    })()}

                    <Button onClick={this.saveData} className='ant-btn-primary'>
                        {langCheck('ZoneSetting-000038', 'pages', json)}
                        {/* /* 国际化处理： 保存*/}
                    </Button>
                    <Button
                        onClick={() => {
                            this.setModalVisibel(true);
                        }}
                    >
                        {langCheck('ZoneSetting-000039', 'pages', json)}
                        {/* /* 国际化处理： 预览*/}
                    </Button>
                    {/* <Popconfirm
                        title="确定取消配置？"
                        onConfirm={() => {
                            if (this.props.status) {
                                // 实施态
                                if (this.props.status === "templateSetting") {
                                    openPage(`/TemplateSetting`, false, {}, [
                                        "status",
                                        "templetid"
                                    ]);
                                } else if (
                                    this.props.status === "templateSetting-unit"
                                ) {
                                    openPage(
                                        `/TemplateSetting-unit`,
                                        false,
                                        {},
                                        ["status", "templetid"]
                                    );
                                }
                            } else {
                                //开发态
                                openPage(
                                    `/ar`,
                                    false,
                                    {
                                        b1: "动态建模平台",
                                        b2: "开发配置",
                                        b3: "应用管理",
                                        n: "应用注册",
                                        c: "102202APP"
                                    },
                                    ["templetid", "appcode", "pcode", "pid"]
                                );
                            }
                        }}
                        placement="top"
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button>取消</Button>
                    </Popconfirm> */}
                    <Button
                        onClick={() => {
                            // confirm({
                            //     title: '确定要取消吗？',
                            //     okText: '确定',
                            //     okType: 'danger',
                            //     cancelText: '取消',
                            //     mask: false,
                            //     maskClosable: true,
                            //     onOk:() => {
                            //         if (this.props.status) {
                            //             // 实施态
                            //             if (this.props.status === "templateSetting") {
                            //                 openPage(`/TemplateSetting`, false, {}, [
                            //                     "status",
                            //                     "templetid"
                            //                 ]);
                            //             } else if (
                            //                 this.props.status === "templateSetting-unit"
                            //             ) {
                            //                 openPage(
                            //                     `/TemplateSetting-unit`,
                            //                     false,
                            //                     {},
                            //                     ["status", "templetid"]
                            //                 );
                            //             }
                            //         } else {
                            //             //开发态
                            //             openPage(
                            //                 `/ar`,
                            //                 false,
                            //                 {
                            //                     b1: "动态建模平台",
                            //                     b2: "开发配置",
                            //                     b3: "应用管理",
                            //                     n: "应用注册",
                            //                     c: "102202APP"
                            //                 },
                            //                 ["templetid", "appcode", "pcode", "pid"]
                            //             );
                            //         }
                            //     },
                            //     onCancel() {}
                            // })

                            //黎明封装弹出框
                            ControlTip({
                                status: 'warning',
                                title: langCheck('ZoneSetting-000006', 'pages', json),/* 国际化处理： 取消*/
                                msg: langCheck('ZoneSetting-000045', 'pages', json),/* 国际化处理： 确定要取消吗？*/
                                onOk: () => {
                                    if (this.props.status) {
                                        // 实施态
                                        if (this.props.status === 'templateSetting') {
                                            openPage(`/TemplateSetting`, false, {}, [ 'status', 'templetid' ]);
                                        } else if (this.props.status === 'templateSetting-unit') {
                                            openPage(`/TemplateSetting-unit`, false, {}, [ 'status', 'templetid' ]);
                                        }
                                    } else {
                                        //开发态
                                        openPage(
                                            `/ar`,
                                            false,
                                            {
                                                b1: langCheck('ZoneSetting-000041', 'pages', json),/* 国际化处理： 动态建模平台*/
                                                b2: langCheck('ZoneSetting-000042', 'pages', json),/* 国际化处理： 开发配置*/
                                                b3: langCheck('ZoneSetting-000043', 'pages', json),/* 国际化处理： 应用管理*/
                                                n: langCheck('ZoneSetting-000044', 'pages', json),/* 国际化处理： 应用注册*/
                                                c: '102202APP'
                                            },
                                            [ 'templetid', 'appcode', 'pcode', 'pid' ]
                                        );
                                    }
                                }
                            });
                        }}
                    >
                        {langCheck('ZoneSetting-000006', 'pages', json)}
                        {/* /* 国际化处理： 取消*/}
                    </Button>
                </div>
                {previewVisibel && (
                    <PreviewModal previewVisibel={previewVisibel} setModalVisibel={this.setModalVisibel} templetid={this.props.templetid} />
                )}
            </div>
        );
    }
}
export default connect(
    (state) => ({
        areaList: state.zoneSettingData.areaList
    }),
    {}
)(withRouter(MyHeader));

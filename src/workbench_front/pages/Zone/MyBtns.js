import React, { Component } from 'react';
import { Button, Layout, Modal } from 'antd';
import { connect } from 'react-redux';
import { setZoneData } from 'Store/Zone/action';
import Ajax from 'Pub/js/ajax';
import { GetQuery, langCheck } from 'Pub/js/utils';
import Notice from 'Components/Notice';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { openPage } from 'Pub/js/superJump';
import { ControlTip } from 'Components/ControlTip';
const confirm = Modal.confirm;
import ButtonCreate from 'Components/ButtonCreate';
/**
 * 工作桌面 配置模板区域
 */
class MyBtns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            siderHeight: '280',
            state: 'browse'
        };
    }
    // 校验tableCode
    validateCode = (list) => {
        let { json } = this.props;
        let foreCheck,
            afterCheck,
            result = true;
        foreCheck = list && list.length;
        afterCheck = _.uniqBy(list, 'code') && _.uniqBy(list, 'code').length;
        // 校验code重复
        if (foreCheck > afterCheck) {
            Notice({ status: 'error', msg: langCheck('102202APP-000011', "pages", json) }); /* 国际化处理： 区域编码不能重复*/
            result = false;
            return result;
        }
        // 校验为空
        _.forEach(list, (v, i) => {
            if (!v.code || !v.name) {
                Notice({ status: 'error', msg: langCheck('102202APP-000012', "pages", json) }); /* 国际化处理： 区域编码或名称不能为空*/
                result = false;
                return result;
            }
        });
        return result;
    };
    // 保存 区域数据
    saveZoneData = (list, form, type) => {
        let { json } = this.props;
        let param = GetQuery(this.props.location.search);
        let url, datas;
        url = '/nccloud/platform/templet/settempletarea.do';
        let { zoneDatas } = this.props;
        datas = {
            pk_page_templet: zoneDatas.pk_page_templet,
            pagecode: zoneDatas.pagecode || param.pcode,
            pageid: zoneDatas.pageid || param.pid,
            parentid: zoneDatas.parentid || 'root',
            areaList: list,
            isdefault: zoneDatas.isdefault,
            appcode: param.appcode || zoneDatas.appcode,
            clazz: zoneDatas.clazz,
            mateid: zoneDatas.mateid,
            ...form
        };
        //  校验 表格的合法性
        let validateResult = this.validateCode(list);
        if (validateResult) {
            Ajax({
                url: url,
                data: datas,
                info: {
                    name: langCheck('102202APP-000013', "pages", json) /* 国际化处理： 保存区域*/,
                    action: langCheck('102202APP-000014', "pages", json) /* 国际化处理： 保存区域设置*/
                },
                success: ({ data }) => {
                    if (data.success && data.data) {
                        if (!data.data.templetid) {
                            Notice({ status: 'error', msg: data.data.msg });
                            return;
                        }
                        this.props.setZoneData({});
                        // type =1 代表保存  type =2 表示下一步
                        type === 1
                            ? openPage(
                                  `/ar`,
                                  false,
                                  {
                                      b1: langCheck('102202APP-000015', "pages", json) /* 国际化处理： 动态建模平台*/,
                                      b2: langCheck('102202APP-000016', "pages", json) /* 国际化处理： 开发配置*/,
                                      b3: langCheck('102202APP-000017', "pages", json) /* 国际化处理： 应用管理*/,
                                      n: langCheck('102202APP-000018', "pages", json) /* 国际化处理： 应用注册*/,
                                      c: '102202APP'
                                  },
                                  [ 'templetid', 'appcode', 'pcode', 'pid' ]
                              )
                            : openPage(`/ZoneSetting`, false, {
                                  templetid: data.data.templetid,
                                  pcode: datas.pagecode,
                                  pid: datas.pageid,
                                  appcode: datas.appcode
                              });
                    }
                }
            });
        }
    };
    //删除左右两端的空格
    trim = (str) => {
        if (str) {
            return str.replace(/^\s+|\s+$/g, '');
        }
    };
    // 处理按钮的事件
    handleClick = (code) => {
        let param = GetQuery(this.props.location.search);
        let fromData = this.props.zoneFormData();
        let { newListData, json, zoneDatas } = this.props;
        switch (code) {
            case 'save':
                if (!fromData.code || !this.trim(fromData.code) || !this.trim(fromData.name)) {
                    Notice({ status: 'warning', msg: langCheck('102202APP-000063', "pages", json) }); /* 国际化处理： 请完善表单信息*/
                    return;
                }
                if (!fromData || !newListData || newListData.length <= 0) {
                    Notice({ status: 'warning', msg: langCheck('102202APP-000019', "pages", json) }); /* 国际化处理： 请完善表格和表单信息*/
                    return;
                }
                this.saveZoneData(newListData, fromData, 1);
                break;
            case 'next':
                if (!fromData.code || !this.trim(fromData.code) || !this.trim(fromData.name)) {
                    Notice({ status: 'warning', msg: langCheck('102202APP-000063', "pages", json) }); /* 国际化处理： 请完善表单信息*/
                    return;
                }
                if (!fromData || !newListData || newListData.length <= 0) {
                    Notice({ status: 'warning', msg: langCheck('102202APP-000019', "pages", json) }); /* 国际化处理： 请完善表格和表单信息*/
                    return;
                }
                this.saveZoneData(newListData, fromData, 2);
                break;
            case 'cancel':
                ControlTip({
                    status: 'warning',
                    title: langCheck('102202APP-000022', "pages", json) /* 国际化处理： 是否取消*/,
                    msg: langCheck('102202APP-000020', "pages", json) /* 国际化处理： 是否取消?*/,
                    onOk: () => {
                        openPage(
                            `/ar`,
                            false,
                            {
                                b1: langCheck('102202APP-000015', "pages", json) /* 国际化处理： 动态建模平台*/,
                                b2: langCheck('102202APP-000016', "pages", json) /* 国际化处理： 开发配置*/,
                                b3: langCheck('102202APP-000017', "pages", json) /* 国际化处理： 应用管理*/,
                                n: langCheck('102202APP-000018', "pages", json) /* 国际化处理： 应用注册*/,
                                c: '102202APP'
                            },
                            [ 'templetid', 'appcode', 'pcode', 'pid' ]
                        );
                    }
                });
                break;
            case langCheck('102202APP-000023', "pages", json) /* 国际化处理： 返回*/:
                history.back();
                break;
        }
    };
    render() {
        let { json } = this.props;
        const Btns = [
            {
                name: langCheck('102202APP-000024', "pages", json) /* 国际化处理： 保存*/,
                code: 'save',
                type: '',
                isshow: true
            },
            {
                name: langCheck('102202APP-000025', "pages", json) /* 国际化处理： 下一步*/,
                code: 'next',
                type: 'primary',
                isshow: true
            },
            {
                name: langCheck('102202APP-000022', "pages", json) /* 国际化处理： 取消*/,
                code: 'cancel',
                type: '',
                isshow: true
            }
        ];
        return (
            <div className='myHead'>
                <div className='zone-title'>
                    <span>{langCheck('102202APP-000026', "pages", json)}</span>
                    {/* 国际化处理： 基本信息*/}
                </div>
                <ButtonCreate dataSource={Btns} onClick={this.handleClick} />
            </div>
        );
    }
}
MyBtns = withRouter(MyBtns);
export default connect(
    (state) => {
        let { zoneFormData, newListData, zoneDatas, json } = state.zoneRegisterData;
        return {
            zoneFormData,
            newListData,
            zoneDatas,
            json
        };
    },
    {
        setZoneData
    }
)(MyBtns);

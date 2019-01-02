import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Input } from 'antd';
import {
    setSelectedTemKeys,
    setParentIdcon,
    setTemplateNameVal,
    setTemplatePk,
    setTemplateTitleVal,
    setCopyId,
    setTemplateType
} from 'Store/TemplateSetting-unit/action';
import { DeferFn, langCheck } from 'Pub/js/utils';
import Ajax from 'Pub/js/ajax.js';
import Notice from 'Components/Notice';
class CopyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codeErrorMsg:'',
            ErrorMsg:''
        };
    }
    componentDidMount() {}
    trim = (str) => {
        if (str) {
            return str.replace(/^\s+|\s+$/g, '');
        }
    };
    checkCode = () => {
        let { json, templateTitleVal } = this.props;
        if (!this.trim(templateTitleVal)) {
            document.getElementById('templateCode').classList.add('has-error');
            this.setState({
                codeErrorMsg: langCheck('10181TM-000020',"pages", json) //  模板编码不能为空
            });
            return;
        }
        document.getElementById('templateCode').classList.remove('has-error');
        this.setState({
            codeErrorMsg: ''
        });
    };
    checkName = () => {
        let { json, templateNameVal } = this.props;
        if (!this.trim(templateNameVal)) {
            document.getElementById('templateName').classList.add('has-error');
            this.setState({
                nameErrorMsg: langCheck('10181TM-000062',"pages", json) //名称不能为空
            });
            return;
        }
        this.setState({
            nameErrorMsg: ''
        });
        document.getElementById('templateName').classList.remove('has-error');
    };
    handleOk = () => {
        const {
            orgidObj,
            def1,
            templatePk,
            pageCode,
            appCode,
            templateNameVal,
            templateTitleVal,
            setSelectedTemKeys,
            setParentIdcon,
            setTemplateNameVal,
            setTemplatePk,
            setTemplateTitleVal,
            setCopyId,
            json,
            setTemplateType
        } = this.props;
        if (!this.trim(templateNameVal)) {
            return;
        }
        let infoData = {
            pageCode: pageCode,
            templateId: templatePk,
            name: templateNameVal,
            appCode: appCode,
            orgId: orgidObj.refpk
        };
        let url;
        if (def1 === 'apppage') {
            infoData.templateType = 'bill';
            url = `/nccloud/platform/template/copyTemplate.do`;
        } else if (def1 === 'menuitem') {
            if (!this.trim(templateTitleVal)) {
                return;
            }
            infoData.templateType = 'print';
            infoData.templateCode = templateTitleVal;
            url = `/nccloud/platform/template/copyPrintTemplate.do`;
        }
        var _this = this;
        DeferFn(() => {
            Ajax({
                url: url,
                data: infoData,
                info: {
                    name: langCheck('10181TM-000009',"pages", json),/* 国际化处理： 模板设置*/
                    action: langCheck('10181TM-000021',"pages", json)/* 国际化处理： 模板复制*/
                },
                success: ({ data }) => {
                    if (data.success) {
                        Notice({ status: 'success', msg: langCheck('10181TM-000022',"pages", json) });/* 国际化处理： 复制成功*/
                        setSelectedTemKeys([ data.data.id ]);
                        setParentIdcon(data.data.id);
                        setTemplateNameVal(data.data.name);
                        setTemplatePk(data.data.id);
                        setCopyId(data.data.id);
                        setTemplateType('org');
                        if (def1 === 'menuitem') {
                            setTemplateTitleVal(data.data.code);
                        }
                        _this.props.reqTreeTemData('copy');
                        _this.handleCancel();
                    }
                }
            });
        });
    };
    handleCancel = () => {
        this.props.setCopyVisible(false);
    };
    render() {
        let { def1, treeTemPrintData, templateTitleVal, templateNameVal, json } = this.props;
        let {codeErrorMsg, nameErrorMsg}=this.state;
        return (
            <Modal
                mask={true}
                closable={false}
                title={langCheck('10181TM-000052',"pages", json)}/* 国际化处理： 复制*/
                visible={this.props.visible}
                onOk={this.handleOk}
                okText={langCheck('10181TM-000013',"pages", json)}/* 国际化处理： 确定*/
                cancelText={langCheck('10181TM-000014',"pages", json)}/* 国际化处理： 取消*/
                centered={true}
                onCancel={this.handleCancel}
                maskClosable={false}
            >
                <div className='copyTemplate'>
                    {def1 == 'menuitem' &&
                    treeTemPrintData.length > 0 && (
                        <div className='templateCode'>
                            <label htmlFor=''>{langCheck('10181TM-000026',"pages", json)}</label>{/* 国际化处理： 模板编码*/}
                            <Input
                                style={{ width: '80%' }}
                                value={templateTitleVal}
                                id='templateCode'
                                onBlur={this.checkCode}
                                placeholder={langCheck('10181TM-000024',"pages", json)}/* 国际化处理： 请输入编码*/
                                onChange={(e) => {
                                    const templateTitleVal = e.target.value;
                                    this.props.setTemplateTitleVal(templateTitleVal);
                                }}
                            />
                            <p className='areaCode-errorMsg'>{codeErrorMsg}</p>
                        </div>
                    )}
                    <div className='templateName'>
                        <label htmlFor=''>{langCheck('10181TM-000027',"pages", json)}</label>{/* 国际化处理： 模板名称*/}
                        <Input
                            value={templateNameVal}
                            style={{ width: '80%' }}
                            id='templateName'
                            onBlur={this.checkName}
                            placeholder={langCheck('10181TM-000025',"pages", json)}/* 国际化处理： 请输入名称*/
                            onChange={(e) => {
                                const templateNameVal = e.target.value;
                                this.props.setTemplateNameVal(templateNameVal);
                            }}
                        />
                        <p className='areaName-errorMsg'>{nameErrorMsg}</p>
                    </div>
                </div>
            </Modal>
        );
    }
}
CopyComponent.propTypes = {
    templatePk: PropTypes.string.isRequired,
    pageCode: PropTypes.string.isRequired,
    appCode: PropTypes.string.isRequired,
    def1: PropTypes.string.isRequired,
    templateTitleVal: PropTypes.string.isRequired,
    templateNameVal: PropTypes.string.isRequired
};
export default connect(
    (state) => ({
        templatePk: state.TemplateSettingUnitData.templatePk,
        pageCode: state.TemplateSettingUnitData.pageCode,
        appCode: state.TemplateSettingUnitData.appCode,
        def1: state.TemplateSettingUnitData.def1,
        templateTitleVal: state.TemplateSettingUnitData.templateTitleVal,
        templateNameVal: state.TemplateSettingUnitData.templateNameVal,
        treeTemPrintData: state.TemplateSettingUnitData.treeTemPrintData,
        orgidObj: state.TemplateSettingUnitData.orgidObj,
        json: state.TemplateSettingUnitData.json
    }),
    {
        setSelectedTemKeys,
        setParentIdcon,
        setTemplateNameVal,
        setTemplatePk,
        setTemplateTitleVal,
        setCopyId,
        setTemplateType
    }
)(CopyComponent);

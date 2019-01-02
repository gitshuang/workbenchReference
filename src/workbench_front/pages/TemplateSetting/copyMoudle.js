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
    setCopyId
} from 'Store/TemplateSetting/action';
import { DeferFn, langCheck } from 'Pub/js/utils';
import Ajax from 'Pub/js/ajax.js';
import Notice from 'Components/Notice';
class CopyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameErrorMsg: '',
            codeErrorMsg: ''
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
                codeErrorMsg: langCheck('10180TM-000024', "pages", json) //  模板编码不能为空
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
                nameErrorMsg: langCheck('10180TM-000023', "pages", json) //名称不能为空
            });
            return;
        }
        this.setState({
            nameErrorMsg: ''
        });
        document.getElementById('templateName').classList.remove('has-error');
    };
    handleOk = () => {
        let {
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
            json
        } = this.props;
        if (!this.trim(templateNameVal)) {
            return;
        }
        document.getElementById('templateName').classList.remove('has-error');
        let infoData = {
            pageCode: pageCode,
            templateId: templatePk,
            name: templateNameVal,
            appCode: appCode
        };
        let url;
        if (def1 === 'apppage') {
            infoData.templateType = 'bill';
            url = `/nccloud/platform/template/copyTemplate.do`;
        } else if (def1 === 'menuitem') {
            if (!this.trim(templateTitleVal)) {
                return;
            }
            document.getElementById('templateCode').classList.remove('has-error');
            infoData.templateCode = templateTitleVal;
            url = `/nccloud/platform/template/copyPrintTemplate.do`;
        }
        var _this = this;
        DeferFn(() => {
            Ajax({
                url: url,
                data: infoData,
                info: {
                    name: langCheck('10180TM-000012', "pages", json) /* 国际化处理： 模板设置*/,
                    action: langCheck('10180TM-000025', "pages", json) /* 国际化处理： 模板复制*/
                },
                success: ({ data }) => {
                    if (data.success) {
                        Notice({ status: 'success', msg: data.msg });
                        setSelectedTemKeys([ data.data.id ]);
                        setParentIdcon(data.data.id);
                        setTemplateNameVal(data.data.name);
                        setTemplatePk(data.data.id);
                        setCopyId(data.data.id);
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
        const { nameErrorMsg, codeErrorMsg } = this.state;
        let { def1, treeTemPrintData, templateTitleVal, templateNameVal, json } = this.props;
        return (
            <Modal
                mask={true}
                closable={false}
                title={langCheck('10180TM-000046', "pages", json)} /* 国际化处理： 复制*/
                visible={this.props.visible}
                onOk={this.handleOk}
                okText={langCheck('10180TM-000015', "pages", json)} /* 国际化处理： 确定*/
                cancelText={langCheck('10180TM-000016', "pages", json)} /* 国际化处理： 取消*/
                centered={true}
                onCancel={this.handleCancel}
                maskClosable={false}
            >
                <div className='copyTemplate'>
                    {def1 == 'menuitem' &&
                    treeTemPrintData.length > 0 && (
                        <div className='templateCode'>
                            <label htmlFor=''>{langCheck('10180TM-000027', "pages", json)}</label>
                            {/* 国际化处理： 模板编码：*/}
                            <Input
                                style={{ width: '80%' }}
                                id='templateCode'
                                onBlur={this.checkCode}
                                value={templateTitleVal}
                                placeholder={langCheck('10180TM-000028', "pages", json)} /* 国际化处理： 模板编码*/
                                onChange={(e) => {
                                    const templateTitleVal = e.target.value;
                                    this.props.setTemplateTitleVal(templateTitleVal);
                                }}
                            />
                            <p className='areaCode-errorMsg'>{codeErrorMsg}</p>
                        </div>
                    )}
                    <div className='templateName'>
                        <label htmlFor=''>{langCheck('10180TM-000029', "pages", json)}</label>
                        {/* 国际化处理： 模板名称：*/}
                        <Input
                            value={templateNameVal}
                            style={{ width: '80%' }}
                            id='templateName'
                            onBlur={this.checkName}
                            placeholder={langCheck('10180TM-000030', "pages", json)} /* 国际化处理： 模板名称*/
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
    templateNameVal: PropTypes.string.isRequired,
    json: PropTypes.object.isRequired
};
export default connect(
    (state) => ({
        templatePk: state.TemplateSettingData.templatePk,
        pageCode: state.TemplateSettingData.pageCode,
        appCode: state.TemplateSettingData.appCode,
        def1: state.TemplateSettingData.def1,
        templateTitleVal: state.TemplateSettingData.templateTitleVal,
        templateNameVal: state.TemplateSettingData.templateNameVal,
        treeTemPrintData: state.TemplateSettingData.treeTemPrintData,
        json: state.TemplateSettingData.json
    }),
    {
        setSelectedTemKeys,
        setParentIdcon,
        setTemplateNameVal,
        setTemplatePk,
        setTemplateTitleVal,
        setCopyId
    }
)(CopyComponent);

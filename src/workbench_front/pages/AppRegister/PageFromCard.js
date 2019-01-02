import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FormContent, dataDefaults } from "Components/FormCreate";
import { setNodeData } from "Store/AppRegister/action";
import PageTable from "./PageTable";
import { langCheck } from 'Pub/js/utils';
class PageFormCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        let isEdit = this.props.isEdit;
        let langJson=this.props.langJson;
        let {
            pagecode,
            pagename,
            pageurl,
            isdefault,
            iscarddefault,
            resid,
            pagedesc
        } = this.props.nodeData;
        let pageFormData = [
            {
                label: langCheck('102202APP-000103', "pages", langJson),/* 国际化处理： 页面编码*/
                type: "string",
                code: "pagecode",
                isRequired: true,
                initialValue: pagecode,
                isedit: isEdit,
                md: 24,
                lg: 12,
                xl: 12
            },
            {
                label: langCheck('102202APP-000104', "pages", langJson),/* 国际化处理： 页面名称*/
                type: "string",
                code: "pagename",
                isRequired: true,
                initialValue: pagename,
                isedit: isEdit,
                md: 24,
                lg: 12,
                xl: 12
            },
            {
                label: langCheck('102202APP-000105', "pages", langJson),/* 国际化处理： 页面地址*/
                type: "string",
                code: "pageurl",
                isRequired: true,
                initialValue: pageurl,
                isedit: isEdit,
                md: 24,
                lg: 12,
                xl: 12
            },
            {
                label: langCheck('102202APP-000047', "pages", langJson),/* 国际化处理： 多语字段*/
                type: "string",
                code: "resid",
                isRequired: false,
                initialValue: resid,
                isedit: isEdit,
                md: 24,
                lg: 12,
                xl: 12
            },
            {
                label: langCheck('102202APP-000021', "pages", langJson),/* 国际化处理： 默认页面*/
                type: "checkbox",
                code: "isdefault",
                isRequired: true,
                initialValue: isdefault,
                isedit: isEdit,
                md: 24,
                lg: 12,
                xl: 12
            },
            {
                label: langCheck('102202APP-000106', "pages", langJson),/* 国际化处理： 默认卡片页面*/
                type: "checkbox",
                code: "iscarddefault",
                isRequired: false,
                initialValue: iscarddefault,
                isedit: isEdit,
                md: 24,
                lg: 12,
                xl: 12
            },
            {
                label: langCheck('102202APP-000107', "pages", langJson),/* 国际化处理： 页面描述*/
                type: "string",
                code: "pagedesc",
                isRequired: false,
                initialValue: pagedesc,
                isedit: isEdit,
                md: 24,
                lg: 24,
                xl: 24
            }
        ];
        return (
            <div>
                <FormContent
                    form={this.props.form}
                    formData={pageFormData}
                    datasources={dataDefaults(
                        this.props.nodeData,
                        pageFormData,
                        "code"
                    )}
                />
                <div
                    style={{
                        marginTop: "30px",
                        background: "#ffffff",
                        borderRadius: "6px"
                    }}
                >
                    <PageTable />
                </div>
            </div>
        );
    }
}
PageFormCard.propTypes = {
    isEdit: PropTypes.bool.isRequired,
    nodeData: PropTypes.object.isRequired,
    setNodeData: PropTypes.func.isRequired
};
export default connect(
    state => ({
        nodeData: state.AppRegisterData.nodeData,
        isEdit: state.AppRegisterData.isEdit,
        langJson: state.AppRegisterData.langJson
    }),
    { setNodeData }
)(PageFormCard);

import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FormContent, dataDefaults } from "Components/FormCreate";
import PageTable from "./PageTable";
import { langCheck } from 'Pub/js/utils';
class PageFormCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        let isEdit = this.props.isEdit;
        let {langJson}=this.props;
        let {
            pagecode,
            pagename,
            pageurl,
            isdefault,
            resid,
            pagedesc
        } = this.props.nodeData;
        let pageFormData = [
            {
                label: langCheck('101818AM-000062',"pages", langJson),/* 国际化处理： 页面编码*/
                type: "string",
                code: "pagecode",
                isRequired: true,
                isedit: isEdit,
                initialValue: pagecode,
                lg: 12
            },
            {
                label: langCheck('101818AM-000086',"pages", langJson),/* 国际化处理： 页面名称*/
                type: "string",
                code: "pagename",
                isRequired: true,
                isedit: isEdit,
                initialValue: pagename,
                lg: 12
            },
            {
                label: langCheck('101818AM-000087',"pages", langJson),/* 国际化处理： 页面地址*/
                type: "string",
                code: "pageurl",
                isRequired: true,
                isedit: isEdit,
                initialValue: pageurl,
                md: 24,
                lg: 24,
                xl: 24
            },
            {
                label: langCheck('101818AM-000088',"pages", langJson),/* 国际化处理： 设为默认页面*/
                type: "checkbox",
                code: "isdefault",
                isRequired: true,
                initialValue: isdefault,
                isedit: isEdit,
                lg: 12
            },
            {
                label: langCheck('101818AM-000053',"pages", langJson),/* 国际化处理： 多语字段*/
                type: "string",
                code: "resid",
                isRequired: false,
                initialValue: resid,
                isedit: isEdit,
                lg: 12
            },
            {
                label: langCheck('101818AM-000089',"pages", langJson),/* 国际化处理： 页面描述*/
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
};
export default connect(
    state => ({
        nodeData: state.AppManagementData.nodeData,
        isEdit: state.AppManagementData.isEdit,
        langJson:state.AppManagementData.langJson
    }),
    { }
)(PageFormCard);

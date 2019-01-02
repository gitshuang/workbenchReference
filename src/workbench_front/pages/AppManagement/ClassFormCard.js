import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormContent, dataDefaults } from 'Components/FormCreate';
import { langCheck } from 'Pub/js/utils';
class ClassFromCard extends Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        let isEdit = this.props.isEdit;
        let { code, name, resid, app_desc, help_name } = this.props.nodeData;
        let { langJson } = this.props;
        let classFormData = [
            {
                label: langCheck('101818AM-000004',"pages", langJson) /* 国际化处理： 应用编码*/,
                type: 'string',
                code: 'code',
                isRequired: true,
                len: 6,
                initialValue: code,
                isedit: isEdit
            },
            {
                label: langCheck('101818AM-000031',"pages", langJson) /* 国际化处理： 应用名称*/,
                type: 'string',
                code: 'name',
                isRequired: true,
                initialValue: name,
                isedit: isEdit
            },
            {
                label: langCheck('101818AM-000053',"pages", langJson) /* 国际化处理： 多语字段*/,
                type: 'string',
                code: 'resid',
                isRequired: false,
                initialValue: resid,
                isedit: isEdit
            },
            {
                label: langCheck('101818AM-000055',"pages", langJson) /* 国际化处理： 应用描述*/,
                type: 'string',
                code: 'app_desc',
                isRequired: false,
                initialValue: app_desc,
                isedit: isEdit
            },
            {
                label: langCheck('101818AM-000054',"pages", langJson) /* 国际化处理： 帮助文件名*/,
                type: 'string',
                code: 'help_name',
                initialValue: help_name,
                isRequired: false,
                isedit: isEdit
            }
        ];
        return (
            <FormContent
                form={this.props.form}
                formData={classFormData}
                datasources={dataDefaults(this.props.nodeData, classFormData, 'code')}
            />
        );
    }
}
ClassFromCard.propTypes = {
    isEdit: PropTypes.bool.isRequired,
    nodeData: PropTypes.object.isRequired
};
export default connect(
    (state) => ({
        nodeData: state.AppManagementData.nodeData,
        isEdit: state.AppManagementData.isEdit,
        langJson: state.AppManagementData.langJson
    }),
    {}
)(ClassFromCard);

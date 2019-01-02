import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormContent, dataDefaults } from 'Components/FormCreate';
import AppTable from './AppTable';
import Ajax from 'Pub/js/ajax';
import { langCheck } from 'Pub/js/utils';

class AppFromCard extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            orgtypecode: [],
            target_path: []
        };
    }
    /**
     * 获取组织类型 下拉数据
     * @param {String} code
     */
    getOptionsData = (code, nodeData) => {
        let { langJson } = this.props;
        let url, data, info;
        if (JSON.stringify(nodeData) === '{}') {
            return;
        }
        if (code === 'target_path') {
            url = `/nccloud/platform/appregister/querypagesel.do`;
            data = { pk_appregister: nodeData.pk_appregister };
            info = {
                name: langCheck('101818AM-000028', 'pages', langJson) /* 国际化处理： 默认页面*/,
                action: langCheck('101818AM-000029', 'pages', langJson) /* 国际化处理： 查询*/
            };
        } else {
            if (this.state.orgtypecode.length > 0) {
                return;
            }
            url = `/nccloud/platform/appregister/queryorgtype.do`;
            info = {
                name: langCheck('101818AM-000030', 'pages', langJson) /* 国际化处理： 组织类型*/,
                action: langCheck('101818AM-000029', 'pages', langJson) /* 国际化处理： 查询*/
            };
        }
        Ajax({
            url: url,
            data: data,
            info: info,
            success: ({ data: { success, data } }) => {
                if (success && data) {
                    if (code === 'target_path') {
                        this.setState({ target_path: data });
                    } else {
                        let options = data.rows;
                        options = options.map((option, i) => {
                            return {
                                value: option.refpk,
                                text: option.refname
                            };
                        });
                        this.setState({ orgtypecode: options });
                    }
                }
            }
        });
    };
    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.nodeData && this.props.nodeData.pk_appregister !== nextProps.nodeData.pk_appregister) {
            this.getOptionsData('orgtypecode', nextProps.nodeData);
            this.getOptionsData('target_path', nextProps.nodeData);
        }
    }
    componentDidMount() {
        this.getOptionsData('orgtypecode', this.props.nodeData);
        this.getOptionsData('target_path', this.props.nodeData);
    }

    render() {
        let isEdit = this.props.isEdit;
        let resNodeData = this.props.form.getFieldsValue();
        let apptypeNum = '1';
        if (resNodeData) {
            apptypeNum = resNodeData.apptype;
        }
        let {
            code,
            name,
            orgtypecode,
            fun_property,
            funtype,
            apptype,
            width,
            height,
            mdidRef,
            isenable,
            uselicense_load,
            iscauserusable,
            iscopypage,
            target_path,
            pk_groupRef,
            resid,
            help_name,
            app_desc,
            image_src
        } = this.props.nodeData;
        let { langJson } = this.props;
        const IMGS = [
            {
                title: langCheck('101818AM-000007', 'pages', langJson) /* 国际化处理： 业务图标*/,
                iconList: [
                    {
                        name: langCheck('101818AM-000008', 'pages', langJson) /* 国际化处理： 报表查询*/,
                        value: 'reportquery',
                        src: 'reportquery'
                    },
                    {
                        name: langCheck('101818AM-000009', 'pages', langJson) /* 国际化处理： 单据维护*/,
                        value: 'documentsmaintenance',
                        src: 'documentsmaintenance'
                    },
                    {
                        name: langCheck('101818AM-000010', 'pages', langJson) /* 国际化处理： 基本档案*/,
                        value: 'basicfile',
                        src: 'basicfile'
                    },
                    {
                        name: langCheck('101818AM-000011', 'pages', langJson) /* 国际化处理： 业务处理*/,
                        value: 'businessprocess',
                        src: 'businessprocess'
                    },
                    {
                        name: langCheck('101818AM-000012', 'pages', langJson) /* 国际化处理： 业务设置*/,
                        value: 'businesssetup',
                        src: 'businesssetup'
                    }
                ]
            },
            {
                title: langCheck('101818AM-000013', 'pages', langJson) /* 国际化处理： 自定义图标*/,
                iconList: [
                    {
                        name: langCheck('101818AM-000014', 'pages', langJson) /* 国际化处理： 凭证处理*/,
                        value: 'credentialprocessing',
                        src: 'credentialprocessing'
                    },
                    {
                        name: langCheck('101818AM-000015', 'pages', langJson) /* 国际化处理： 期末处理*/,
                        value: 'finalprocessing',
                        src: 'finalprocessing'
                    },
                    {
                        name: langCheck('101818AM-000016', 'pages', langJson) /* 国际化处理： 打印*/,
                        value: 'print',
                        src: 'print'
                    },
                    {
                        name: langCheck('101818AM-000017', 'pages', langJson) /* 国际化处理： 默认*/,
                        value: 'default0',
                        src: 'default0'
                    },
                    {
                        name: langCheck('101818AM-000018', 'pages', langJson) /* 国际化处理： 默认1*/,
                        value: 'default1',
                        src: 'default1'
                    },
                    {
                        name: langCheck('101818AM-000019', 'pages', langJson) /* 国际化处理： 默认2*/,
                        value: 'default2',
                        src: 'default2'
                    },
                    {
                        name: langCheck('101818AM-000020', 'pages', langJson) /* 国际化处理： 默认3*/,
                        value: 'default3',
                        src: 'default3'
                    },
                    {
                        name: langCheck('101818AM-000021', 'pages', langJson) /* 国际化处理： 默认4*/,
                        value: 'default4',
                        src: 'default4'
                    },
                    {
                        name: langCheck('101818AM-000022', 'pages', langJson) /* 国际化处理： 默认5*/,
                        value: 'default5',
                        src: 'default5'
                    },
                    {
                        name: langCheck('101818AM-000023', 'pages', langJson) /* 国际化处理： 默认6*/,
                        value: 'default6',
                        src: 'default6'
                    },
                    {
                        name: langCheck('101818AM-000024', 'pages', langJson) /* 国际化处理： 默认7*/,
                        value: 'default7',
                        src: 'default7'
                    },
                    {
                        name: langCheck('101818AM-000025', 'pages', langJson) /* 国际化处理： 默认8*/,
                        value: 'default8',
                        src: 'default8'
                    },
                    {
                        name: langCheck('101818AM-000026', 'pages', langJson) /* 国际化处理： 默认9*/,
                        value: 'default9',
                        src: 'default9'
                    },
                    {
                        name: langCheck('101818AM-000027', 'pages', langJson) /* 国际化处理： 默认10*/,
                        value: 'default10',
                        src: 'default10'
                    }
                ]
            }
        ];
        let appFormData = [
            {
                label: langCheck('101818AM-000004', 'pages', langJson) /* 国际化处理： 应用编码*/,
                type: 'string',
                code: 'code',
                isRequired: true,
                initialValue: code,
                isedit: isEdit
            },
            {
                label: langCheck('101818AM-000031', 'pages', langJson) /* 国际化处理： 应用名称*/,
                type: 'string',
                code: 'name',
                isRequired: true,
                isedit: isEdit,
                initialValue: name
            },
            {
                label: langCheck('101818AM-000030', 'pages', langJson) /* 国际化处理： 组织类型*/,
                type: 'select',
                code: 'orgtypecode',
                isRequired: true,
                options: this.state.orgtypecode,
                isedit: isEdit,
                initialValue: orgtypecode
            },
            {
                label: langCheck('101818AM-000032', 'pages', langJson) /* 国际化处理： 功能性质*/,
                type: 'select',
                code: 'fun_property',
                isRequired: true,
                initialValue: fun_property,
                options: [
                    {
                        value: '0',
                        text: langCheck('101818AM-000033', 'pages', langJson) /* 国际化处理： 可执行功能*/
                    },
                    {
                        value: '1',
                        text: langCheck('101818AM-000034', 'pages', langJson) /* 国际化处理： 附属功能*/
                    },
                    {
                        value: '2',
                        text: langCheck('101818AM-000035', 'pages', langJson) /* 国际化处理： 云应用*/
                    }
                ],
                isedit: isEdit
            },
            {
                label: langCheck('101818AM-000036', 'pages', langJson) /* 国际化处理： 功能点类型*/,
                type: 'select',
                code: 'funtype',
                isRequired: true,
                initialValue: funtype,
                options: [
                    {
                        value: '0',
                        text: langCheck('101818AM-000037', 'pages', langJson) /* 国际化处理： 业务类应用*/
                    },
                    {
                        value: '1',
                        text: langCheck('101818AM-000038', 'pages', langJson) /* 国际化处理： 管理类应用*/
                    },
                    {
                        value: '2',
                        text: langCheck('101818AM-000039', 'pages', langJson) /* 国际化处理： 系统类应用*/
                    },
                    {
                        value: '3',
                        text: langCheck('101818AM-000040', 'pages', langJson) /* 国际化处理： 管理+业务类应用*/
                    }
                ],
                isedit: isEdit
            },
            {
                label: langCheck('101818AM-000041', 'pages', langJson) /* 国际化处理： 应用类型*/,
                type: 'select',
                code: 'apptype',
                isRequired: true,
                initialValue: apptype,
                options: [
                    {
                        value: '1',
                        text: langCheck('101818AM-000042', 'pages', langJson) /* 国际化处理： 小应用*/
                    },
                    {
                        value: '2',
                        text: langCheck('101818AM-000043', 'pages', langJson) /* 国际化处理： 小部件*/
                    }
                ],
                isedit: isEdit
            },
            {
                label: langCheck('101818AM-000044', 'pages', langJson) /* 国际化处理： 应用宽*/,
                type: 'string',
                code: 'width',
                isRequired: true,
                isedit: isEdit,
                initialValue: width
            },
            {
                label: langCheck('101818AM-000045', 'pages', langJson) /* 国际化处理： 应用高*/,
                type: 'string',
                code: 'height',
                isRequired: true,
                isedit: isEdit,
                initialValue: height
            },
            {
                label: langCheck('101818AM-000046', 'pages', langJson) /* 国际化处理： 关联元数据ID*/,
                type: 'refer',
                code: 'mdidRef',
                isRequired: false,
                initialValue: mdidRef,
                options: {
                    queryTreeUrl: '/nccloud/riart/ref/mdClassDefaultEntityRefTreeAction.do',
                    refType: 'tree',
                    isTreelazyLoad: false,
                    placeholder: langCheck('101818AM-000046', 'pages', langJson) /* 国际化处理： 关联元数据ID*/
                },
                isedit: isEdit
            },
            {
                label: langCheck('101818AM-000047', 'pages', langJson) /* 国际化处理： 启用*/,
                type: 'checkbox',
                code: 'isenable',
                isRequired: false,
                isedit: isEdit,
                initialValue: isenable
            },
            {
                label: langCheck('101818AM-000048', 'pages', langJson) /* 国际化处理： 加载占用许可*/,
                type: 'checkbox',
                code: 'uselicense_load',
                isRequired: false,
                initialValue: uselicense_load,
                isedit: isEdit
            },
            {
                label: langCheck('101818AM-000049', 'pages', langJson) /* 国际化处理： CA用户可用*/,
                type: 'checkbox',
                code: 'iscauserusable',
                isRequired: false,
                isedit: isEdit,
                initialValue: iscauserusable
            },
            {
                label: langCheck('101818AM-000050', 'pages', langJson) /* 国际化处理： 可复制页面*/,
                type: 'checkbox',
                code: 'iscopypage',
                isRequired: false,
                isedit: isEdit,
                initialValue: iscopypage
            },
            {
                label:
                    apptypeNum === '1'
                        ? langCheck('101818AM-000028', 'pages', langJson)
                        : langCheck('101818AM-000051', 'pages', langJson) /* 国际化处理： 默认页面,小部件路径*/,
                type: apptypeNum === '1' ? 'select' : 'string',
                code: 'target_path',
                isRequired: apptypeNum === '2',
                options: this.state.target_path,
                isedit: isEdit,
                initialValue: target_path
            },
            {
                label: langCheck('101818AM-000052', 'pages', langJson) /* 国际化处理： 所属集团*/,
                type: 'refer',
                code: 'pk_groupRef',
                isRequired: false,
                isedit: false,
                initialValue: pk_groupRef
            },
            {
                label: langCheck('101818AM-000053', 'pages', langJson) /* 国际化处理： 多语字段*/,
                type: 'string',
                code: 'resid',
                isRequired: false,
                isedit: isEdit,
                initialValue: resid
            },
            {
                label: langCheck('101818AM-000054', 'pages', langJson) /* 国际化处理： 帮助文件名*/,
                type: 'string',
                code: 'help_name',
                isRequired: false,
                isedit: isEdit,
                initialValue: help_name
            },
            {
                label: langCheck('101818AM-000055', 'pages', langJson) /* 国际化处理： 应用描述*/,
                type: 'string',
                code: 'app_desc',
                isRequired: false,
                initialValue: app_desc,
                md: 24,
                lg: 24,
                xl: 24,
                isedit: isEdit
            },
            {
                label: langCheck('101818AM-000056', 'pages', langJson) /* 国际化处理： 图标路径*/,
                type: 'chooseImage',
                code: 'image_src',
                isRequired: apptypeNum === '1',
                options: IMGS,
                hidden: apptypeNum === '2',
                initialValue: image_src,
                md: 24,
                lg: 24,
                xl: 24,
                isedit: isEdit
            }
        ];
        return (
            <div>
                <FormContent
                    form={this.props.form}
                    formData={appFormData}
                    datasources={dataDefaults(
                        this.props.nodeData,
                        appFormData.filter((item) => item.hidden === false),
                        'code'
                    )}
                />
                <div
                    style={{
                        marginTop: '30px',
                        background: '#ffffff',
                        borderRadius: '6px'
                    }}
                >
                    <AppTable />
                </div>
            </div>
        );
    }
}
AppFromCard.propTypes = {
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
)(AppFromCard);

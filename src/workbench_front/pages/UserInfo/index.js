import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setEmail } from "Store/appStore/action";
import { Form, Modal } from "antd";
import { PageLayout, PageLayoutHeader } from "Components/PageLayout";
import { withRouter } from "react-router-dom";
import Notice from "Components/Notice";
import Ajax from "Pub/js/ajax";
import InfoForm from "./InfoForm";
import PasswordEdit from "./PasswordEdit";
import PhoneEdit from "./PhoneEdit";
import EmailEdit from "./EmailEdit";
import RSAUtils from "Pub/js/security.js";
import "./index.less";
import { getMulti } from "Pub/js/getMulti";
import { langCheck } from "Pub/js/utils.js";
class SwitchInfo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };
        switch (this.props.infoType) {
            // 密码修改
            case "0":
                return (
                    <PasswordEdit
                        layout={formItemLayout}
                        formObj={this.props.formObj}
                        json={this.props.json}
                        exponent={this.props.exponent}
                        modulus={this.props.modulus}
                    />
                );
            // 手机修改
            case "1":
                return (
                    <PhoneEdit
                        layout={formItemLayout}
                        formObj={this.props.formObj}
                        json={this.props.json}
                        exponent={this.props.exponent}
                        modulus={this.props.modulus}
                    />
                );
            // 邮箱修改
            case "2":
                return (
                    <EmailEdit
                        layout={formItemLayout}
                        formObj={this.props.formObj}
                        json={this.props.json}
                        exponent={this.props.exponent}
                        modulus={this.props.modulus}
                    />
                );
            default:
                return "";
        }
    }
}
class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editData: {},
            infoType: "",
            modalTitle: "",
            visible: false,
            picture: "",
            phone: "",
            email: "",
            exponent: "",
            modulus: "",
            json: {}
        };
    }
    /**
     * 弹框标题选择
     */
    switchTitle = key => {
        let { json } = this.state;
        switch (key) {
            case "0":
                return langCheck(
                    "UserInfo-000015",
                    "pages",
                    json
                ); /* 国际化处理： 密码修改*/
            case "1":
                return langCheck(
                    "UserInfo-000016",
                    "pages",
                    json
                ); /* 国际化处理： 手机修改*/
            case "2":
                return langCheck(
                    "UserInfo-000017",
                    "pages",
                    json
                ); /* 国际化处理： 电子邮箱修改*/
            default:
                break;
        }
    };
    showModal = infoType => {
        let modalTitle = this.switchTitle(infoType);
        this.setState({
            visible: true,
            infoType,
            modalTitle
        });
    };
    handleOk = type => {
        // 表单提交前进行校验
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let allValue = this.props.form.getFieldsValue();
                this.saveInfo(type, allValue);
            }
        });
    };
    /**
     * 用户信息保存
     * @param {String} key "0" - 密码修改 "1" - 手机修改 "2" - 电子邮件修改
     * @param {Object} data 需要保存的数据
     */
    saveInfo = (key, data) => {
        let { json } = this.state;
        let RSAkey = RSAUtils.getKeyPair(
            this.state.exponent,
            "",
            this.state.modulus
        );
        switch (key) {
            case "0":
                Ajax({
                    url: `/nccloud/platform/appregister/resetuserpwd.do`,
                    data: {
                        oldPassword: RSAUtils.encryptedString(RSAkey, data.pw),
                        newPassword: RSAUtils.encryptedString(
                            RSAkey,
                            data.newpw
                        )
                    },
                    info: {
                        name: langCheck(
                            "UserInfo-000000",
                            "pages",
                            json
                        ) /* 国际化处理： 账户设置*/,
                        action: langCheck(
                            "UserInfo-000018",
                            "pages",
                            json
                        ) /* 国际化处理： 密码设置*/
                    },
                    success: ({ data: { data } }) => {
                        Notice({ status: "success", msg: data.msg });
                        this.handleCancel();
                    }
                });
                break;
            case "1":
                return langCheck(
                    "UserInfo-000016",
                    "pages",
                    json
                ); /* 国际化处理： 手机修改*/
            case "2":
                Ajax({
                    url: `/nccloud/platform/email/updatebind.do`,
                    data: {
                        email: data.email,
                        password: RSAUtils.encryptedString(RSAkey, data.pw),
                        captcha: data.captcha
                    },
                    loading: true,
                    info: {
                        name: langCheck(
                            "UserInfo-000019",
                            "pages",
                            json
                        ) /* 国际化处理： 更新用户邮箱*/,
                        action: langCheck(
                            "UserInfo-000019",
                            "pages",
                            json
                        ) /* 国际化处理： 更新用户邮箱*/
                    },
                    success: ({ data: { data: resData } }) => {
                        if (resData.status) {
                            this.props.setEmail(data.email);
                            Notice({ status: "success", msg: resData.msg });
                            this.handleCancel();
                        } else {
                            Notice({ status: "typeError", msg: resData.msg });
                        }
                    }
                });
                break;
            default:
                break;
        }
    };
    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false
        });
    };
    /**
     * 返回按钮
     */
    handleBackClick = () => {
        this.props.history.push("/");
    };
    componentDidMount() {
        let callback = json => {
            this.setState({
                json: json
            });
            /**
             * 获取加密秘钥
             */
            Ajax({
                url: `/nccloud/platform/appregister/querypublickey.do`,
                data: {},
                info: {
                    name: langCheck(
                        "UserInfo-000000",
                        "pages",
                        json
                    ) /* 国际化处理： 账户设置*/,
                    action: langCheck(
                        "UserInfo-000018",
                        "pages",
                        json
                    ) /* 国际化处理： 密码设置*/
                },
                success: ({ data: { data } }) => {
                    this.setState({
                        exponent: data.exponent,
                        modulus: data.modulus
                    });
                }
            });
        };
        getMulti({
            moduleId: "UserInfo",
            // currentLocale: 'zh-CN',
            domainName: "workbench",
            callback
        });
    }
    render() {
        let { picture, phone, email, json } = this.state;
        return (
            <PageLayout
                className="workbench-userinfo"
                header={
                    <PageLayoutHeader>
                        <div className="back" onClick={this.handleBackClick}>
                            <i className="iconfont icon-fanhuishangyiji" />
                            {langCheck(
                                "UserInfo-000000",
                                "pages",
                                json
                            ) /* 国际化处理： 账户设置*/}
                        </div>
                    </PageLayoutHeader>
                }
            >
                <div
                    style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <InfoForm
                        picture={picture}
                        phone={phone}
                        email={email}
                        infoSetting={this.showModal}
                        json={json}
                    />
                    <Modal
                        closable={false}
                        maskClosable={false}
                        title={this.state.modalTitle}
                        destroyOnClose={true}
                        mask={true}
                        wrapClassName="vertical-center-modal"
                        visible={this.state.visible}
                        onOk={e => {
                            e.preventDefault();
                            this.handleOk(this.state.infoType);
                        }}
                        onCancel={this.handleCancel}
                        okText={langCheck(
                            "UserInfo-000004",
                            "pages",
                            json
                        )} /* 国际化处理： 确定*/
                        cancelText={langCheck(
                            "UserInfo-000005",
                            "pages",
                            json
                        )} /* 国际化处理： 取消*/
                    >
                        <div className="userinfo-modal-content">
                            <SwitchInfo
                                infoType={this.state.infoType}
                                formObj={this.props.form}
                                json={json}
                                exponent={this.state.exponent}
                                modulus={this.state.modulus}
                            />
                        </div>
                    </Modal>
                </div>
            </PageLayout>
        );
    }
}
UserInfo.propTypes = {
    setEmail: PropTypes.func.isRequired
};
const WrappedUserInfo = Form.create()(UserInfo);
export default withRouter(
    connect(
        state => ({}),
        {
            setEmail
        }
    )(WrappedUserInfo)
);

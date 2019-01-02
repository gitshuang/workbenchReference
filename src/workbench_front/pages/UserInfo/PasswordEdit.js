import React, { Component } from "react";
import { Form, Input } from "antd";
import Ajax from "Pub/js/ajax";
import RSAUtils from "Pub/js/security.js";
import { langCheck } from "Pub/js/utils.js";
const FormItem = Form.Item;

class PasswordEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validate: true,
            confirmDirty: false,
            msg: ""
        };
    }
    handlePwCheck = e => {
        const form = this.props.formObj;
        let value = e.target.value;
        let { json } = this.props;
        if (value === "") {
            this.setState({ validate: false });
            return;
        }
        let RSAkey = RSAUtils.getKeyPair(
            this.props.exponent,
            "",
            this.props.modulus
        );
        Ajax({
            url: `/nccloud/platform/appregister/checkuserpwd.do`,
            info: {
                name: langCheck(
                    "UserInfo-000000",
                    "pages",
                    json
                ) /* 国际化处理： 账户设置*/,
                action: langCheck(
                    "UserInfo-000031",
                    "pages",
                    json
                ) /* 国际化处理： 密码校验*/
            },
            data: {
                oldPassword: RSAUtils.encryptedString(RSAkey, value)
            },
            success: ({ data: { data } }) => {
                if (data && !data.status) {
                    form.setFields({
                        pw: {
                            value: value,
                            errors: [new Error(data.msg)]
                        }
                    });
                    // this.setState({ validate: data.status, msg: data.msg });
                }
            }
        });
    };
    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    validateToNextNewPassword = (rule, value, callback) => {
        if (value === "") {
            callback();
        }
        const form = this.props.formObj;
        if (value && this.state.confirmDirty) {
            form.validateFields(["newpw"], { force: true });
        }
        callback();
    };
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.formObj;
        let { json } = this.props;
        if (value && value === form.getFieldValue("pw")) {
            callback(
                langCheck("UserInfo-000032", "pages", json)
            ); /* 国际化处理： 新密码不能与原始密码相同!*/
        }
        if (value && this.state.confirmDirty) {
            form.validateFields(["confirmpw"], { force: true });
        }
        callback();
    };
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.formObj;
        let { json } = this.props;
        if (value && value !== form.getFieldValue("newpw")) {
            callback(
                langCheck("UserInfo-000033", "pages", json)
            ); /* 国际化处理： 两次密码输入不一致，请重试*/
        } else {
            callback();
        }
    };
    componentWillReceiveProps(nextProps) {
        this.setState({ confirmDirty: false });
    }
    render() {
        let { layout, formObj, json } = this.props;
        let { getFieldDecorator } = formObj;
        return (
            <Form>
                <FormItem
                    className="userinfo-item"
                    colon={false}
                    {...layout}
                    label={langCheck(
                        "UserInfo-000034",
                        "pages",
                        json
                    )} /* 国际化处理： 旧密码*/
                >
                    {getFieldDecorator("pw", {
                        rules: [
                            {
                                required: true,
                                message: langCheck(
                                    "UserInfo-000035",
                                    "pages",
                                    json
                                ) /* 国际化处理： 请输入原始密码！*/
                            },
                            {
                                validator: this.validateToNextNewPassword
                            }
                        ]
                    })(
                        <Input
                            onBlur={this.handlePwCheck}
                            type="password"
                            autocomplete="new-password"
                        />
                    )}
                </FormItem>
                <FormItem
                    className="userinfo-item"
                    colon={false}
                    {...layout}
                    label={langCheck(
                        "UserInfo-000036",
                        "pages",
                        json
                    )} /* 国际化处理： 新密码*/
                >
                    {getFieldDecorator("newpw", {
                        rules: [
                            {
                                required: true,
                                message: langCheck(
                                    "UserInfo-000037",
                                    "pages",
                                    json
                                ) /* 国际化处理： 请输入新密码！*/
                            },
                            {
                                validator: this.validateToNextPassword
                            }
                        ]
                    })(<Input type="password" />)}
                </FormItem>
                <FormItem
                    className="userinfo-item"
                    colon={false}
                    {...layout}
                    label={langCheck(
                        "UserInfo-000038",
                        "pages",
                        json
                    )} /* 国际化处理： 确认密码*/
                >
                    {getFieldDecorator("confirmpw", {
                        rules: [
                            {
                                required: true,
                                message: langCheck(
                                    "UserInfo-000039",
                                    "pages",
                                    json
                                ) /* 国际化处理： 请再次确认新密码！*/
                            },
                            {
                                validator: this.compareToFirstPassword
                            }
                        ]
                    })(
                        <Input
                            type="password"
                            onBlur={this.handleConfirmBlur}
                        />
                    )}
                </FormItem>
            </Form>
        );
    }
}
export default PasswordEdit;

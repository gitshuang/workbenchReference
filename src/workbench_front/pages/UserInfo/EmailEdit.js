import React, { Component } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import Notice from "Components/Notice";
import Ajax from "Pub/js/ajax";
import { langCheck } from "Pub/js/utils.js";
const FormItem = Form.Item;
class EmailEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prompt: false,
            num: 0
        };
    }
    /**
     * 获取验证码
     */
    handleGetCaptcha = () => {
        const formObj = this.props.formObj;
        let { json } = this.props;
        // let emailVale = formObj.getFieldValue("email");
        formObj.validateFields(["pw", "email"], (error, values) => {
            // console.log(error, values);
            if (!error) {
                if (this.state.num > 0) {
                    return;
                }
                if (this.state.num == 0) {
                    Ajax({
                        url: `/nccloud/platform/email/sendcaptcha.do`,
                        data: { email: values.email },
                        info: {
                            name: langCheck('UserInfo-000006', 'pages', json),/* 国际化处理： 发送验证码*/
                            action: langCheck('UserInfo-000006', 'pages', json)/* 国际化处理： 发送验证码*/
                        },
                        success: ({ data: { data } }) => {
                            if (data.status) {
                                this.setState(
                                    {
                                        prompt: true,
                                        num: 60
                                    },
                                    this.captchaCount
                                );
                            }
                            Notice({
                                status: data.status ? "success" : "error",
                                msg: data.msg
                            });
                        }
                    });
                }
            }
        });
    };
    /**
     * 验证码计数
     */
    captchaCount = () => {
        let fun = () => {
            let num = this.state.num;
            if (num === 0) {
                this.setState({ prompt: false });
                clearInterval(timer);
            } else {
                num--;
            }
            this.setState({ num });
        };
        let timer = setInterval(fun, 1000);
    };
    render() {
        let { layout, formObj, json } = this.props;
        let { getFieldDecorator } = formObj;
        return (
            <Form>
                <FormItem
                    className="userinfo-item"
                    {...layout}
                    colon={false}
                    label={langCheck('UserInfo-000007', 'pages', json)}/* 国际化处理： 密码*/
                >
                    {getFieldDecorator("pw", {
                        rules: [
                            {
                                required: true,
                                message: langCheck('UserInfo-000008', 'pages', json)/* 国际化处理： 请输入密码！*/
                            }
                        ]
                    })(<Input type="password" autocomplete="new-password"/>)}
                </FormItem>
                <FormItem
                    className="userinfo-item"
                    {...layout}
                    colon={false}
                    label="E-mail"
                >
                    {getFieldDecorator("email", {
                        rules: [
                            {
                                type: "email",
                                message: langCheck('UserInfo-000009', 'pages', json)/* 国际化处理： 输入不是有效的电子邮箱！*/
                            },
                            {
                                required: true,
                                message: langCheck('UserInfo-000010', 'pages', json)/* 国际化处理： 请输入电子邮箱!*/
                            }
                        ]
                    })(<Input />)}
                </FormItem>
                <FormItem
                    className="userinfo-item"
                    {...layout}
                    colon={false}
                    label={langCheck('UserInfo-000011', 'pages', json)}/* 国际化处理： 验证码*/
                    extra={
                        this.state.prompt
                            ? langCheck('UserInfo-000012', 'pages', json)/* 国际化处理： 验证码已发送至您的电子邮箱，请注意查收！*/
                            : ""
                    }
                >
                    <Row gutter={8}>
                        <Col span={12}>
                            {getFieldDecorator("captcha", {
                                rules: [
                                    { required: true, message: langCheck('UserInfo-000013', 'pages', json) }/* 国际化处理： 请输入验证码!*/
                                ]
                            })(<Input />)}
                        </Col>
                        <Col span={12}>
                            <Button
                                type="primary"
                                className="captcha-btn"
                                onClick={this.handleGetCaptcha}
                            >
                                {langCheck('UserInfo-000014', 'pages', json)/* 国际化处理： 获取验证码*/}
                                {this.state.num > 0
                                    ? `(${this.state.num})`
                                    : ""}
                            </Button>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
        );
    }
}
export default EmailEdit;

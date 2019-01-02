import React, { Component } from "react";
import { Form, Input, Select, Button, Row, Col } from "antd";
import { langCheck } from "Pub/js/utils.js";
const FormItem = Form.Item;
const Option = Select.Option;
class PhoneEdit extends Component {
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
        if (this.state.num > 0) {
            return;
        }
        this.setState(
            {
                prompt: true,
                num: 60
            },
            this.captchaCount
        );
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
        const prefixSelector = getFieldDecorator("prefix", {
            initialValue: "86"
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );
        return (
            <Form>
                <FormItem
                    className="userinfo-item"
                    colon={false}
                    {...layout}
                    label={langCheck('UserInfo-000007', 'pages', json)}/* 国际化处理： 密码*/
                >
                    {getFieldDecorator("pw", {
                        rules: [
                            {
                                required: true,
                                message: langCheck('UserInfo-000008', 'pages', json)/* 国际化处理： 请输入密码！*/
                            }
                        ]
                    })(<Input type="password" />)}
                </FormItem>
                <FormItem
                    className="userinfo-item"
                    colon={false}
                    {...layout}
                    label={langCheck('UserInfo-000040', 'pages', json)}/* 国际化处理： 手机号*/
                >
                    {getFieldDecorator("phone", {
                        rules: [
                            {
                                required: true,
                                message: "Please input your phone number!"
                            }
                        ]
                    })(
                        <Input
                            addonBefore={prefixSelector}
                            style={{ width: "100%" }}
                        />
                    )}
                </FormItem>
                <FormItem
                    className="userinfo-item"
                    {...layout}
                    colon={false}
                    label={langCheck('UserInfo-000011', 'pages', json)}/* 国际化处理： 验证码*/
                    extra={
                        this.state.prompt
                            ? langCheck('UserInfo-000041', 'pages', json)/* 国际化处理： 验证码已发送至您的手机，请注意查收！*/
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
export default PhoneEdit;

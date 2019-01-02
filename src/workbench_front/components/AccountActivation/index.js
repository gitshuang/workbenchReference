import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Steps, Tabs, Input, Form, InputNumber, Select } from 'antd';
import Ajax from '../../pub/js/ajax';
import { gotCountryCode, countryCodeObj } from './countryCode';
import Notice from 'Components/Notice';
import { langCheck } from 'Pub/js/utils';
import './index.less';
import { openPage } from 'Pub/js/superJump';
import ACONE from 'Assets/images/ac1.png';
import ACTWO from 'Assets/images/ac2.png';
import ACTHREE from 'Assets/images/ac3.png';
import { connect } from 'react-redux';
import { bindSuccess } from 'Store/appStore/action';

const InputGroup = Input.Group;
const FormItem = Form.Item;
const Option = Select.Option;

class AccountActivation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isFirst: true,
            loginWay: 'mobile',
            key: new Date().getTime().toString(),
            countryCodeNum: '86',
            num: 0,
            genCodeSuccess: false,
            step: 0,
            registUrl: '',
            phoneNum: '',
            imgUrl: '',
            bindInitStatus: 0,
            errorMsg: '',
            countryCode: null
        };
    }

    updateActivationPopState() {
        Ajax({
            url: `/nccloud/baseapp/yht/bindinit.do`,
            info: {
                name: langCheck('0000PUB-000211'),/* 国际化处理： 首页*/
                action: langCheck('0000PUB-000212')/* 国际化处理： 首页激活弹窗*/
            },
            success: function({ data: { data } }) {
                switch (parseInt(data.status)) {
                    case 0:
                        // 进入弹窗第一步;
                        this.setState({
                            visible: true,
                            registUrl: data.registUrl,
                            imgUrl: data.imgUrl
                        });
                        break;
                    case 1:
                        // 进入弹窗第二步;
                        this.setState({
                            visible: true,
                            step: 1,
                            registUrl: data.registUrl,
                            phoneNum: data.mobile,
                            imgUrl: data.imgUrl
                        });
                        break;
                    case 5:
                        // 弹出错误提示信息并不可操作
                        this.setState({
                            visible: true,
                            bindInitStatus: 5,
                            errorMsg: data.msg
                        });
                        break;
                    default:
                        break;
                }
            }.bind(this)
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false
        });
        this.props.bindSuccess();
    };
    // 下一步
    goNextPart = () => {
        if(this.state.bindInitStatus === 5) {
            this.showErrorMsg();
            return;
        }
        this.setState((prevState, props) => {
            if (prevState.step === 1) {
                return { step: prevState.step + 2 };
            } else {
                return { step: prevState.step + 1 };
            }
        });
    };
    // 切换登陆方式
    switchLoginWay = () => {
        this.setState((prevState) => ({
            loginWay: prevState.loginWay === 'mobile' ? 'email' : 'mobile',
            countryCodeNum: '86'
        }));
    };
    // 图形验证码
    genImg = () => {
        let src = this.state.imgUrl + this.state.key;
        return <img id='picImg' src={src} onClick={this.refreshImg} />;
    };

    refreshImg = (e) => {
        let d = new Date().getTime().toString();
        this.setState({
            key: d
        });
        let src = this.state.imgUrl + d;
        e.target.src = src;
    };
    captchaCount = () => {
        let fun = () => {
            let num = this.state.num;
            if (num === 0) {
                // this.setState({ prompt: false });
                clearInterval(timer);
            } else {
                num--;
            }
            this.setState({ num });
        };
        let timer = setInterval(fun, 1000);
    };
    // 生成验证码
    genCode = () => {
        let ajaxData = {
            key: this.state.key,
            type: this.state.loginWay,
            countryCode: this.state.countryCodeNum
        };
        const { getFieldsValue, validateFields } = this.props.form;
        let accountLabel = this.state.loginWay === 'email' ? langCheck('0000PUB-000213') : langCheck('0000PUB-000214');/* 国际化处理： 邮箱,手机号*/
        validateFields([ accountLabel, langCheck('0000PUB-000215') ], (errors, values) => {/* 国际化处理： 图形验证码*/
            if (errors) {
                return;
            } else {
                // ajaxData.account = ((accountLabel === '手机号') ? this.state.countryCodeNum : '' ) + values[accountLabel];
                ajaxData.account = values[accountLabel];
                ajaxData.code = values[langCheck('0000PUB-000215')];/* 国际化处理： 图形验证码*/

                Ajax({
                    url: '/nccloud/baseapp/yht/send.do',
                    info: {
                        name: langCheck('0000PUB-000216'),/* 国际化处理： 友互通弹窗*/
                        action: langCheck('0000PUB-000217')/* 国际化处理： 生成验证码*/
                    },
                    data: ajaxData,
                    success: function({ data: { data } }) {
                        if (parseInt(data.status)) {
                            this.setState({
                                genCodeSuccess: true,
                                num: 60
                            });
                            this.captchaCount();
                        } else {
                            this.setState({
                                genCodeSuccess: false
                            });
                            document.getElementById('picImg').click();
                        }
                        Notice({
                            status: parseInt(data.status) ? 'success' : 'error',
                            msg: data.msg
                        });
                    }.bind(this)
                });
            }
        });
    };
    // 成功消息提示 位置不确定
    successMessage = () => {};

    activeCode = () => {
        let ajaxData = {
            type: this.state.loginWay,
            countryCode: this.state.countryCodeNum
        };
        const { getFieldsValue, validateFields } = this.props.form;
        let accountLabel = this.state.loginWay === 'email' ? langCheck('0000PUB-000213') : langCheck('0000PUB-000214');/* 国际化处理： 邮箱,手机号*/
        validateFields([ accountLabel, langCheck('0000PUB-000215'), langCheck('0000PUB-000218') ], (errors, values) => {/* 国际化处理： 图形验证码,验证码*/
            if (errors) {
                return;
            } else {
                ajaxData.account = values[accountLabel];
                ajaxData.activeCode = values[langCheck('0000PUB-000218')];/* 国际化处理： 验证码*/
                Ajax({
                    url: '/nccloud/baseapp/yht/bind.do',
                    info: {
                        name: langCheck('0000PUB-000216'),/* 国际化处理： 友互通弹窗*/
                        action: langCheck('0000PUB-000219')/* 国际化处理： 激活账号*/
                    },
                    data: ajaxData,
                    success: function({ data: { data } }) {
                        if (parseInt(data.status)) {
                            this.goNextPart();
                        }
                        Notice({
                            status: parseInt(data.status) ? 'success' : 'error',
                            msg: data.msg
                        });
                    }.bind(this)
                });
            }
        });
    };
    switchCountry = (value) => {
        this.setState({
            countryCodeNum: value
        });
    };
    // 手机号前缀部分
    renderTelPrefix = () => (
        <Select onChange={this.switchCountry} defaultValue={langCheck('0000PUB-000200')} dropdownMatchSelectWidth={false}>{/* 国际化处理： 中国*/}
            {Object.keys(this.state.countryCode.data).map((ele, index) => <Option value={ele}>{this.state.countryCode.data[ele]}</Option>)}
        </Select>
    );
    // 跳转到配置桌面
    handeleSkipPage = (uri, param) => {
        let { isOpen } = this.props;
        openPage(uri, false, param, [ 'b1', 'b2', 'b3' ]);
        this.handleCancel();
    };
    // status为5时的错误提示.
    showErrorMsg = () => {
        Notice({
            status: 'warning',
            msg: this.state.errorMsg
        });
    }
    handleAClick = () => {
        if(this.state.bindInitStatus === 5) {
            this.showErrorMsg();
        } else {
            window.open(this.state.registUrl, '_blank') ;
        }
    }
    render() {
        const { getFieldDecorator, getFieldsValue, validateFields, setFieldsValue } = this.props.form;

        

        // 顶部状态栏
        const StatusBar = () => {
            const Step = Steps.Step;
            return (
                <Steps progressDot size='small' current={this.state.step} className='status-bar'>
                    <Step title={langCheck('0000PUB-000220')} />{/* 国际化处理： 选择类型*/}
                    <Step title={langCheck('0000PUB-000221')} />{/* 国际化处理： 绑定账户*/}
                    <Step title={langCheck('0000PUB-000222')} />{/* 国际化处理： 激活成功*/}
                </Steps>
            );
        };
        // 根据state的步骤来判断渲染第几部分
        const partRender = (step) => {
            switch (step) {
                case 0:
                    return PartOne;
                    break;
                case 1:
                    return PartTwo();
                    break;
                case (2, 3):
                    return PartThree;
                    break;
                default:
                    return null;
            }
        };
        // 部分一 需要放图片
        const PartOne = (
            <div className='part-one'>
                <div>
                    <span onClick={this.handleAClick}>
                        <a>
                            <img src={ACONE} />
                        </a>
                    </span>
                    <span onClick={this.goNextPart}>
                        <img src={ACTWO} />
                    </span>
                </div>
                <div>
                    <p>{langCheck('0000PUB-000224')}</p>{/* 国际化处理： 没有用友云账户，前往注册*/}
                    <p>{langCheck('0000PUB-000225')}</p>{/* 国际化处理： 已有用友云账户，直接激活*/}  
                </div>
            </div>
        );
        // 公用的样式
        const layout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 14 }
        };
        // 账号小模块
        const AccountPart = () => {
            let phoneNum = this.state.phoneNum;
            const emailInput = (
                <FormItem label={langCheck('0000PUB-000226')} {...layout}>{/* 国际化处理： 邮箱账号*/}
                    {getFieldDecorator(langCheck('0000PUB-000213'), {/* 国际化处理： 邮箱*/
                        rules: [
                            {
                                type: 'email',
                                message: langCheck('0000PUB-000227')/* 国际化处理： 输入不是有效的电子邮箱！*/
                            },
                            {
                                required: true,
                                message: langCheck('0000PUB-000228')/* 国际化处理： 请输入电子邮箱!*/
                            }
                        ],
                        validateTrigger: 'onBlur'
                    })(<Input id='account' placeholder={langCheck('0000PUB-000229')} />)}{/* 国际化处理： 请输入您的邮箱*/}
                </FormItem>
            );

            const mobileInput = (
                <div>
                    {this.renderTelPrefix()}
                    <span className='country-code-num'>+{this.state.countryCodeNum}</span>
                    <FormItem label={langCheck('0000PUB-000214')} {...layout}>
                        {getFieldDecorator(langCheck('0000PUB-000214'), {/* 国际化处理： 手机号*/
                            rules: [
                                {
                                    pattern: /[0-9]{11}/,
                                    message: langCheck('0000PUB-000230')/* 国际化处理： 输入不是有效的手机号！*/
                                },
                                {
                                    required: true,
                                    message: langCheck('0000PUB-000231')/* 国际化处理： 请输入手机号!*/
                                }
                            ],
                            validateTrigger: 'onBlur',
                            initialValue: phoneNum
                        })(<Input className='mobile-input' id='accountPhone' placeholder={langCheck('0000PUB-000232')} />)}
                        {/* 国际化处理： 请输入手机号码*/}
                    </FormItem>
                </div>
            );
            switch (this.state.loginWay) {
                case 'email':
                    return emailInput;
                    break;
                case 'mobile':
                    return mobileInput;
                    break;
                default:
                    return null;
                    break;
            }
        };
        // 部分二 需要增加表单提交验证 成功后自动跳入第三部分.
        const PartTwo = () => {
            const TabPane = Tabs.TabPane;
            return (
                <div className='part-two'>
                    {/* 这次因为没有扫二维码功能 所以先暂时隐藏tabs */}
                    {/* <Tabs defaultActiveKey="1" tabBarStyle={{ width: "320px", margin: "0 auto"}}> */}
                    {/* <TabPane tab="账密激活" key="1"> */}

                    <div className='part-two-input-group'>
                        {AccountPart()}
                        <span className='switch-loginway-btn' onClick={this.switchLoginWay}>
                            <i className='iconfont icon-qiehuanyt' />
                            {this.state.loginWay === 'email' ? langCheck('0000PUB-000233') : langCheck('0000PUB-000234')}{/* 国际化处理： 切换至手机登陆,切换至邮箱登陆*/}
                        </span>
                    </div>
                    <div className='part-two-input-group'>
                        <FormItem label={langCheck('0000PUB-000215')} {...layout}>{/* 国际化处理： 图形验证码*/}
                            {getFieldDecorator(langCheck('0000PUB-000215'), {/* 国际化处理： 图形验证码*/
                                rules: [
                                    {
                                        required: true,
                                        message: langCheck('0000PUB-000235')/* 国际化处理： 请输入图形验证码!*/
                                    }
                                ]
                            })(<Input id='imgCode' placeholder={langCheck('0000PUB-000236')} />)}{/* 国际化处理： 点击刷新验证码*/}
                        </FormItem>
                        {this.genImg()}
                    </div>
                    <div className='part-two-input-group'>
                        <FormItem label={langCheck('0000PUB-000218')} {...layout}>{/* 国际化处理： 验证码*/}
                            {getFieldDecorator(langCheck('0000PUB-000218'), {/* 国际化处理： 验证码*/
                                rules: [
                                    {
                                        required: true,
                                        message: langCheck('0000PUB-000237')/* 国际化处理： 请输入验证码!*/
                                    }
                                ]
                            })(<Input id='code' placeholder={this.state.genCodeSuccess ? langCheck('0000PUB-000238') : ''} />)}{/* 国际化处理： 获取成功,请输入验证码*/}
                            <button
                                disabled={this.state.num === 0 ? false : true}
                                className='btn-getvcode'
                                onClick={this.genCode}
                            >
                                {this.state.num === 0 ? langCheck('0000PUB-000239') : this.state.num + langCheck('0000PUB-000240')}{/* 国际化处理： 获取验证码,秒后重新获取*/}
                            </button>
                        </FormItem>
                    </div>
                    <div className='part-two-input-group'>
                        <label className='btn-label-pos' />
                        <button className='btn-active' onClick={this.activeCode}>
                            {langCheck('0000PUB-000241')}{/* 国际化处理： 立即激活*/}
                        </button>
                    </div>
                    <div className='part-two-input-group'>
                        <label className='btn-label-pos' />
                        <button className='btn-register'>
                            <a href={this.state.registUrl} target='_blank'>
                                {langCheck('0000PUB-000242')}{/* 国际化处理： 没有用友云账户，前往注册*/}
                            </a>
                        </button>
                    </div>
                    {/* </TabPane> */}
                    {/* <TabPane tab="扫码激活" key="2">
                            <div className="part-two-pic-group">
                                <img src=""/>
                                <p>请用友空间App扫描二维码登录
                                    <span className="btn-refresh">刷新</span>
                                </p>
                                <p className="part-two-link">
                                    <a href="">使用帮助</a>
                                    <a href="">下载友空间</a>
                                </p>
                            </div>
                        </TabPane> */}
                    {/* </Tabs> */}
                </div>
            );
        };
        // 部分三 需要更新图片
        const PartThree = (
            <div className='part-three'>
                <p>{langCheck('0000PUB-000244')}</p>{/* 国际化处理： 您的账户已激活成功*/}
                <div>
                    <img src={ACTHREE} />
                </div>
                <div className='btn-group'>
                    <button
                        onClick={() => {
                            this.handeleSkipPage('/ds', { n: langCheck('0000PUB-000247') });/* 国际化处理： 桌面设置*/
                        }}
                    >
                        {langCheck('0000PUB-000248')}{/* 国际化处理： 配置桌面*/}
                    </button>
                    <button onClick={this.handleCancel}>{langCheck('0000PUB-000249')}</button>{/* 国际化处理： 关闭*/}
                </div>
            </div>
        );
        return (
            <div>
                <Modal
                    title={langCheck('0000PUB-000250')}/* 国际化处理： 用友云账户激活*/
                    visible={this.state.visible}
                    footer={null}
                    closable={false}
                    maskClosable={true}
                    wrapClassName='nc-account-activation'
                >
                    {StatusBar()}
                    {partRender(this.state.step)}
                </Modal>
            </div>
        );
    }
    componentDidMount() {
        this.updateActivationPopState();
        gotCountryCode().then((data) => {
            this.setState({
                countryCode: data
            });
        })
    }
}
AccountActivation.propTypes = {
    bindSuccess: PropTypes.func.isRequired,
};
// export default Form.create()(AccountActivation);
export default connect(null, { bindSuccess })(Form.create()(AccountActivation));

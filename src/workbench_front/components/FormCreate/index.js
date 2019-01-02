import React, { Component } from 'react';
import { Form, Row, Col, Checkbox } from 'antd';
import _ from 'lodash';
import EditableChooseImage from './EditableChooseImage';
import EditableString from './EditableString';
import EditableSelect from './EditableSelect';
import EditableRefer from './EditableRefer';
import { langCheck } from 'Pub/js/utils';
import './index.less';
const FormItem = Form.Item;
/**
 * 常规显示
 * 其中包括 type 类型为 string
 */
class NormalShow extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let showValue = this.props.value;
        return (
            <div className='form-display-content' title={showValue}>
                {this.props.value}
            </div>
        );
    }
}
/**
 * 参照显示
 * type 类型为 refer
 */
class ReferShow extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let showValue = this.props.value && this.props.value.refname ? this.props.value.refname : '';
        return (
            <div className='form-display-content' title={showValue}>
                {showValue}
            </div>
        );
    }
}
/**
 * 下拉显示
 * type 类型为 select
 */
class SelectShow extends Component {
    constructor(props) {
        super(props);
    }
    showValue = () => {
        let { options, value } = this.props;
        let option = options.find((item) => item.value === value);
        if (option) {
            return option.text;
        }
        return '';
    };
    render() {
        let showValue = this.showValue();
        return (
            <div className='form-display-content' title={showValue}>
                {showValue}
            </div>
        );
    }
}
/**
 * 复选框显示
 */
class CheckboxShow extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        // let { langCheck } = window;
        let showValue = this.props.checked ? langCheck('0000PUB-000009') : langCheck('0000PUB-000010'); /* 国际化处理： 是,否*/
        return (
            <div className='form-display-content' title={showValue}>
                {showValue}
            </div>
        );
    }
}
/**
 * 表单创建组件
 * formData - 表单数据描述
 * {
    code: "code", - 编码
    type: "string", -类型
    label: "编码", - label
    isRequired: true, - 是否必输
    isedit: isedit - 是否可编辑,
    hidden: false 显示隐藏 默认为 false - 显示 true - 不显示
    options: 组件其他项 object 
    },
 * fields - 表单字段值描述
 * onChange - 表单值改变事件
 */
export class FormContent extends Component {
    constructor(props) {
        super(props);
        this.history;
    }
    createComponent = (item, index) => {
        // let { langCheck } = window;
        const { getFieldDecorator } = this.props.form;
        let { type = 'string', isRequired = false, label = '', code, isedit = false, check, len, initialValue } = item;
        switch (type) {
            case 'string':
                return (
                    <FormItem className='form-item margin-bottom-8' colon={!isedit} label={label}>
                        {getFieldDecorator(code, {
                            initialValue: initialValue,
                            rules: [
                                {
                                    type: 'string',
                                    message: `${label}${langCheck('0000PUB-000015')}-string` /* 国际化处理： 数据类型*/
                                },
                                {
                                    required: isRequired && isedit,
                                    whitespace: true,
                                    message: `${label}${langCheck('0000PUB-000016')}` /* 国际化处理： 为必输项*/
                                },
                                {
                                    len: len,
                                    message: `${label}${langCheck('0000PUB-000017')}${len}` /* 国际化处理： 长度为*/
                                },
                                {
                                    validator: check
                                        ? check
                                        : (rule, value, callback) => {
                                              if (value === '') {
                                                  callback();
                                              } else {
                                                  callback();
                                              }
                                          }
                                }
                            ]
                        })(isedit ? <EditableString form={this.props.form} /> : <NormalShow />)}
                    </FormItem>
                );
            case 'refer':
                return (
                    <FormItem className='form-item margin-bottom-8' colon={!isedit} label={label}>
                        {getFieldDecorator(code, {
                            initialValue: initialValue,
                            rules: [
                                {
                                    required: isRequired && isedit,
                                    validator: isRequired
                                        ? (rule, value, callback) => {
                                              if (value && value.refname) {
                                                  callback();
                                              } else {
                                                  callback(`${label}${langCheck('0000PUB-000016')}`); /* 国际化处理： 为必输项*/
                                              }
                                          }
                                        : (rule, value, callback) => {
                                              callback();
                                          }
                                },
                                {
                                    type: 'object',
                                    message: `${label}${langCheck('0000PUB-000015')}-object` /* 国际化处理： 数据类型*/,
                                    validator: null
                                }
                            ]
                        })(isedit ? <EditableRefer form={this.props.form} options={item.options} /> : <ReferShow />)}
                    </FormItem>
                );
            case 'select':
                return (
                    <FormItem className='form-item margin-bottom-8' colon={!isedit} label={label}>
                        {getFieldDecorator(code, {
                            initialValue: initialValue,
                            rules: [
                                {
                                    type: 'string',
                                    message: `${label}${langCheck('0000PUB-000015')}-string` /* 国际化处理： 数据类型*/,
                                    validator: null
                                },
                                {
                                    required: isRequired && isedit,
                                    message: `${label}${langCheck('0000PUB-000016')}` /* 国际化处理： 为必输项*/
                                }
                            ]
                        })(
                            isedit ? (
                                <EditableSelect
                                    form={this.props.form}
                                    placeholder={`${langCheck('0000PUB-000018')}${label}`} /* 国际化处理： 请选择*/
                                    options={item.options}
                                />
                            ) : (
                                <SelectShow options={item.options} />
                            )
                        )}
                    </FormItem>
                );
            case 'checkbox':
                return (
                    <FormItem colon={!isedit} label={label} className='form-item margin-bottom-8'>
                        {getFieldDecorator(code, {
                            initialValue: initialValue,
                            valuePropName: 'checked'
                        })(isedit ? <Checkbox disabled={!isedit} /> : <CheckboxShow />)}
                    </FormItem>
                );
            case 'chooseImage':
                return (
                    <FormItem label={label}>
                        {getFieldDecorator(code, {
                            initialValue: initialValue,
                            rules: [
                                {
                                    required: isRequired && isedit,
                                    message: langCheck('0000PUB-000011') /* 国际化处理： 请选择图标*/
                                }
                            ]
                        })(
                            <EditableChooseImage
                                form={this.props.form}
                                isedit={isedit}
                                data={item.options}
                                title={
                                    isedit ? langCheck('0000PUB-000012') : langCheck('0000PUB-000013')
                                } /* 国际化处理： 图标选择,已选图标*/
                            />
                        )}
                    </FormItem>
                );
            default:
                break;
        }
    };
    /**
     * 创建表单项
     */
    createFormItem = () => {
        let children = this.props.formData.map((item, index) => {
            let { xs = 24, md = 12, lg = 12, xl = 8, code, hidden = false } = item;
            if (hidden === true) {
                return null;
            }
            return (
                <Col xs={xs} md={md} lg={lg} xl={xl} key={code}>
                    {this.createComponent(item, index)}
                </Col>
            );
        });
        return children;
    };
    componentWillReceiveProps() {
        this.history = this.props.datasources;
    }
    componentDidMount() {
        this.props.form.setFieldsValue(this.props.datasources);
    }
    componentDidUpdate() {
        // 判断历史datasources 与最新的datasources 相等的情况下去更新dom
        if (!_.isEqual(this.props.datasources, this.history)) {
            this.props.form.setFieldsValue(this.props.datasources);
        }
    }
    render() {
        return (
            <Form layout='inline'>
                <Row>{this.createFormItem()}</Row>
            </Form>
        );
    }
}
/**
 * 数据剔除
 *
 */
export const dataDefaults = (newObject, object, code = 'code') => {
    if (JSON.stringify(object) == '{}') {
        console.error(langCheck('0000PUB-000014')); /* 国际化处理： dataTransfer 函数参数不能为空对象*/
        return;
    }
    let Obj = {};
    object.map((item) => {
        if (newObject.hasOwnProperty(item.code)) {
            Obj[item.code] = newObject[item.code];
        }
    });
    return Obj;
};

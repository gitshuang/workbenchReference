import { Col, Form, Input, Select } from 'antd';
import React from 'react';
const FormItem = Form.Item;
import { langCheck } from 'Pub/js/utils';
import Notice from 'Components/Notice';
/**
 * 创建表单
 * @param {*} propsData 
 * @param {*} DOMDATA 
 * @param {*} nodeData 
 */
export const createForm = (DOMDATA, propsData) => {
    const children = [];
    DOMDATA &&
        DOMDATA.map((item, index) => {
            let { lable, md = 24, lg = 12, xl = 8 } = item;
            children.push(
                <Col md={md} lg={lg} xl={xl} key={index}>
                    {createFormItem(propsData, item)}
                </Col>
            );
        });

    return children.filter((item) => {
        return item.props.children;
    });
};
/**
 * 创建表单
 * @param {*} props 
 * @param {*} itemInfo 
 */
const createFormItem = (props, itemInfo) => {
    let nodeData = props.zoneDatas;
    let { json } = props;
    const { getFieldDecorator } = props.form;
    let { lable, type, code, required, check, search } = itemInfo;
    switch (type) {
        case 'select':
            if (nodeData.areaList && nodeData.areaList.length > 0) {
                nodeData.areaList.map((item) => {
                    if (nodeData[code] === item.code && item.areatype === '0') {
                        Notice({ status: 'error', msg: langCheck('102202APP-000000', "pages", json) }); /* 国际化处理： 数据有误*/
                        return;
                    }
                });
            }
            return (
                <FormItem label={lable}>
                    {getFieldDecorator(code, {
                        initialValue: nodeData[code] ? nodeData[code]+ '' : '',
                        rules: [
                            {
                                required: required,
                                message: langCheck('102202APP-000001', "pages", json) /* 国际化处理： 此字段为必输项或请补充此表单区编码！*/
                            },
                            {
                                validator: check ? check : null
                            }
                        ] //disabled={itemInfo.options.length>0 ? false : true}
                    })(<Select>{itemInfo.options}</Select>)}
                </FormItem>
            );
            break;
        default:
            return (
                <FormItem label={lable}>
                    {getFieldDecorator(code, {
                        initialValue: nodeData[code] ? nodeData[code] + '' : '',
                        rules: [
                            {
                                required: required,
                                message: `${langCheck('102202APP-000002', "pages", json)}${lable}` /* 国际化处理： 请输入*/
                            },
                            {
                                validator: check ? check : null
                            }
                        ]
                    })(<Input placeholder={`${langCheck('102202APP-000002', "pages", json)}${lable}`} />)}
                    {/* 国际化处理： 请输入*/}
                </FormItem>
            );
            break;
    }
};

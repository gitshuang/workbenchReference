import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Form, Select } from 'antd';
import { setZoneDataFun } from 'Store/Zone/action';
import { createForm } from './CreatForm';
import { langCheck } from 'Pub/js/utils';
const Option = Select.Option;

class ModuleFromCard extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    /**
	 * 传递 表单的值  
	 */
    getFromData = () => {
        const { getFieldsValue, validateFields } = this.props.form;
        let flag = false;
        validateFields((err, values) => {
            if (!err) {
                flag = true;
            }
        });
        return flag ? getFieldsValue() : null;
    };
    componentDidMount() {
        this.props.setZoneDataFun(this.getFromData);
    }

    /**
	 * @param {*} DOMDATA
	 * 添加表头,最新的逻辑为如果出现Form表单区域，就出现设置表头字段
	*/
    getFormItem = (DOMDATA) => {
        let { newListData } = this.props,
            form = [],
            table = [];
        newListData &&
            newListData.map((v, i) => {
                if (v.areatype === '1') {
                    //表单
                    form.push(v);
                } else if (v.areatype === '2') {
                    //表格
                    table.push(v);
                }
            });

        //过滤掉表头列,当页面不存在Form表单区域
        if (form.length !== 0 || table.length !== 0) {
            let item = DOMDATA.find((item) => item.code === 'headcode');
            if (item) {
                item.options = creatOption();
            }
        } else {
            DOMDATA = DOMDATA && DOMDATA.filter((v, i) => v.code !== 'headcode');
        }
        function creatOption() {
            let newArray =
                newListData &&
                newListData.filter((v, i) => {
                    return v.areatype !== '0';
                });
            return (
                newArray &&
                newArray.map((item, i) => {
                    return (
                        <Option key={item.code} value={item.code}>
                            {item.name}
                        </Option>
                    );
                })
            );
        }
        return DOMDATA;
    };
    render() {
        let { json } = this.props;
        let DOMDATA = [
            {
                lable: langCheck('102202APP-000005', "pages", json) /* 国际化处理： 模板编码*/,
                type: 'input',
                code: 'code',
                required: true
            },
            {
                lable: langCheck('102202APP-000006', "pages", json) /* 国际化处理： 模板名称*/,
                type: 'input',
                code: 'name',
                required: true
            },
            {
                lable: langCheck('102202APP-000007', "pages", json) /* 国际化处理： 多语字段*/,
                type: 'input',
                code: 'resid'
            },
            {
                lable: langCheck('102202APP-000008', "pages", json) /* 国际化处理： 模板描述*/,
                type: 'input',
                code: 'templetdesc',
                required: false
            },
            {
                lable: langCheck('102202APP-000009', "pages", json) /* 国际化处理： 聚合类*/,
                type: 'input',
                code: 'clazz',
                required: false
            },
            {
                lable: langCheck('102202APP-000010', "pages", json) /* 国际化处理： 设置表头*/,
                type: 'select',
                code: 'headcode',
                options: [],
                required: true
            }
        ];
        DOMDATA = this.getFormItem(DOMDATA);
        return (
            <Form className='from-card'>
                <Row gutter={24}>{createForm(DOMDATA, this.props)}</Row>
            </Form>
        );
    }
}
ModuleFromCard = Form.create()(ModuleFromCard); // 必须要包装才能用form的方法
ModuleFromCard.PropTypes = {
    zoneArr: PropTypes.object.isRequired,
    zoneDatas: PropTypes.object.isRequired,
    zoneFormData: PropTypes.object.isRequired,
    setZoneDataFun: PropTypes.func.isRequired
};
export default connect(
    (state) => {
        let { zoneDatas, zoneFormData, newListData, json } = state.zoneRegisterData;
        return { zoneDatas, zoneFormData, newListData, json };
    },
    {
        setZoneDataFun
    }
)(ModuleFromCard);

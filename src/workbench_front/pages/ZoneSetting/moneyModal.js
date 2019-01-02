import React, { Component } from "react";
import { InputNumber, Modal, Button } from "antd";
import Notice from "Components/Notice";
import { langCheck } from "Pub/js/utils";
import { getMulti } from 'Pub/js/getMulti';
//整数、小数、金融类型模态框组件类
export default class MoneyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initVal: this.props.initVal,
            small: "",
            big: "",
            customScale: "",
            json: {}
        };
    }
    //模态框显示，进行数值的初始化
    componentWillReceiveProps(nextProps) {
        if (nextProps.modalVisibel !== true) {
            return;
        } else {
            this.setState({ initVal: nextProps.initVal }, () => {
                let { datatype } = nextProps;
                let { initVal } = this.state;
                //如果初始值是空
                if (initVal === "" || initVal === null) {
                    this.setState({
                        customScale: datatype === "4" ? 0 : 2,
                        small: "",
                        big: ""
                    });
                } else {
                    let initArray = initVal.split(",");
                    if (datatype === "4") {
                        //数据类型为整数
                        this.setState({
                            customScale: 0,
                            small: initArray ? initArray[0] : "",
                            big: initArray ? initArray[1] : ""
                        });
                    } else {//小数、金额
                        this.setState({
                            customScale: initArray ? initArray[0] : 31,
                            small: initArray ? initArray[1] : "",
                            big: initArray ? initArray[2] : ""
                        });
                    }
                }
            });
        }
    }
    //设置数值模态框的是否显示
    showModalHidden = () => {
        this.props.setModalVisibel("moneyModalVisibel", false);
    };
    //设置dataval字段
    onOkDialog = () => {
        let { small, big, customScale, json } = this.state;
        let { datatype } = this.props;
        let result;
        if (small !== "" && big !== "") {
            if (Number(small) >= Number(big)) {
                return Notice({
                    status: "error",
                    msg: langCheck('ZoneSetting-000056', 'pages', json)/* 国际化处理： 所选的最小值与最大值不匹配*/
                });
            }
        }
        if (datatype === "4") {
            //整数
            result = `${small},${big}`;
        } else {
            result = `${customScale},${small},${big}`;
        }
        this.props.handleSelectChange(result, "dataval");
        this.showModalHidden();
    };
    /**
     * 数值输入框字符修改时
     * @param {String} key 
     * @param {String} val 
     */
    saveValue = (key, val) => {
        if (_.isNull(val) || _.isUndefined(val)) {
            val = "";
        }
        this.setState({ [key]: val });
    };

    componentDidMount() {
        //多语
        let callback = (json) => {
			// console.log('json', json);
            this.setState({
                json:json
            });
        };
        getMulti({
            moduleId: 'ZoneSetting',
            // currentLocale: 'zh-CN',
            domainName: 'workbench',
            callback
        });
    }

    render() {
        let { customScale, small, big, json } = this.state;
        let { datatype } = this.props;
        return (
            <div className="myZoneModal">
                <Modal
                    closable={false}
                    title={langCheck('ZoneSetting-000022', 'pages', json)}/* 国际化处理： 类型设置*/
                    mask={false}
                    wrapClassName="zonesetting-moneyModal"
                    visible={this.props.modalVisibel}
                    onOk={this.onOkDialog}
                    destroyOnClose={true}
                    onCancel={this.showModalHidden}
                    footer={[
                        <Button
                            key="submit"
                            type="primary"
                            onClick={this.onOkDialog}
                        >
                            {langCheck('ZoneSetting-000005', 'pages', json)}
                            {/* /* 国际化处理： 确定*/ }
                        </Button>,
                        <Button key="back" onClick={this.showModalHidden}>
                            {langCheck('ZoneSetting-000006', 'pages', json)}
                            {/* /* 国际化处理： 取消*/ }
                        </Button>
                    ]}
                >
                    {(() => {
                        if (datatype !== "4") {
                            //不是整数时
                            return (
                                <div>
                                    <div className="descrip_label">
                                        {langCheck('ZoneSetting-000057', 'pages', json)}{" "}
                                        {/* /* 国际化处理： 精度设置*/ }
                                    </div>
                                    <div className="mdcontent">
                                        <div>
                                            <span className="money-label">
                                                {" "}
                                                {langCheck('ZoneSetting-000058', 'pages', json)}
                                                {/* /* 国际化处理： 自定义精度:*/ }
                                            </span>
                                            <InputNumber
                                                precision={0}
                                                min={0}
                                                max={8}
                                                value={customScale}
                                                onChange={value => {
                                                    this.saveValue(
                                                        "customScale",
                                                        value
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })()}
                    <div>
                        <div className="descrip_label">{langCheck('ZoneSetting-000059', 'pages', json)} </div>
                        {/* /* 国际化处理： 取值设置*/ }
                        <div className="mdcontent">
                            <div>
                                <span className="money-label">{langCheck('ZoneSetting-000060', 'pages', json)}</span>
                                {/* /* 国际化处理： 最小值:*/ }
                                <InputNumber
                                    precision={customScale}
                                    value={small}
                                    onChange={value => {
                                        this.saveValue("small", value);
                                    }}
                                />
                            </div>
                            <div>
                                <span className="money-label">{langCheck('ZoneSetting-000061', 'pages', json)}</span>
                                {/* /* 国际化处理： 最大值:*/ }
                                <InputNumber
                                    value={big}
                                    precision={customScale}
                                    onChange={value => {
                                        this.saveValue("big", value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

import React, { Component } from "react";
import { Modal, Button } from "antd";
// import { high } from "nc-lightapp-front";
import * as platform from 'nc-lightapp-front';
import Ajax from "Pub/js/ajax";
import * as utilService from './utilService';
import { langCheck } from "Pub/js/utils";
import { getMulti } from 'Pub/js/getMulti';
const { high } = platform;
const { Refer } = high;
//默认取值模态框组件类
export default class DefaultValueModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultvalueObj: {},
            json: {}
        };
        this.onOkDialog = this.onOkDialog.bind(this);
    }
    //传入的字符串进行分割，更新模态框内的默认取值对象
    componentWillReceiveProps(nextProps) {
        let { json } = this.state;
        if (nextProps.modalVisibel !== true) {
            return;
        } else {
            let defaultvalueObj = {};
            const {
                defaultvalue,
                isMultiSelectedEnabled,
                refname
            } = nextProps;
            //如果默认取值不为空，进行等号分割字符串
            if (defaultvalue !== "" && defaultvalue !== null) {
                const tmpDefaultvalueList = defaultvalue.split("=");
                defaultvalueObj = {
                    display: tmpDefaultvalueList[0],
                    value: tmpDefaultvalueList[1]
                };
            }
            //如果是查询区域，发送ajax请求获取参照的默认值
            if(nextProps.areatype==='0'){
                Ajax({
                    url: `/nccloud/platform/templet/getRefDefaultSel.do`,
                    info: {
                        name: langCheck('ZoneSetting-000017', 'pages', json),/* 国际化处理： 单据模板设置*/
                        action: langCheck('ZoneSetting-000024', 'pages', json)/* 国际化处理： 查询参照默认下拉选项*/
                    },
                    data: [refname],
                    success: res => {
                        if (res) {
                            let { data, success } = res.data;
                            let refcode;
                            if (success && data) {
                                _.forEach((data),(d)=>{
                                    refcode = d.refpath;
                                    //给code赋值
                                    // this.setState({
                                    //     code: d.code
                                    // });
                                })
                                this.setState({
                                    refcode: refcode,
                                    defaultvalueObj: defaultvalueObj,
                                    isMultiSelectedEnabled: isMultiSelectedEnabled
                                });
                            }
                        }
                    }
                });
            }else{
                this.setState({
                    refcode: nextProps.refcode,
                    defaultvalueObj: defaultvalueObj,
                    isMultiSelectedEnabled: isMultiSelectedEnabled
                });
            }
            
        }
    }
    //设置模态框的隐藏
    showModalHidden = () => {
        this.props.setModalVisibel("defaultValueModalVisibel", false);
    };
    //进行字符串拼接，设置defaultvalue字段
    onOkDialog = () => {
        let defaultvalueObj = this.state.defaultvalueObj;
        const display = defaultvalueObj.display;
        const value = defaultvalueObj.value;
        let defaultvalue = "";
        //原来参照ref和pk值
        if(display !== "" && value !==""){
            defaultvalue = `${display}=${value}`
        }
        // if(display !== "" && this.state.code !==""){
        //     defaultvalue = `${display}=${this.state.code}`
        // }

        this.props.handleSelectChange(defaultvalue, "defaultvalue");
        this.showModalHidden();
    };
    componentDidMount() {
        //把nc-lightapp-front暴露给全局，供全局使用（艺轩）
        window['nc-lightapp-front'] = platform;
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
        let { json } = this.state;
        if(!this.state.refcode){
            return null;
        }
        // console.log('defaultvalueObj', this.state.defaultvalueObj);
        return (
            <Modal
                title={langCheck('ZoneSetting-000025', 'pages', json)}/* 国际化处理： 参照默认值设置*/
                mask={false}
                wrapClassName="zonesetting-defaultValueModal"
                visible={this.props.modalVisibel}
                onOk={this.onOkDialog}
                destroyOnClose={true}
                onCancel={this.showModalHidden}
                footer={[
                    <Button
                        key="submit"
                        // disabled={}
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
                <div className="mdcontent">
                    {(() => {
                        if (this.state[`myRefDom${this.state.refcode}`]) {
                            //参照的特殊写法，有问题联系艺轩
                            const myRefDom = this.state[
                                `myRefDom${this.state.refcode}`
                            ];
                            const tmpRefDom = myRefDom();
                            return (
                                    <Refer
                                        isMultiSelectedEnabled={
                                            this.state.isMultiSelectedEnabled
                                        }
                                        {...tmpRefDom.props}
                                        foolValue={this.state.defaultvalueObj}
                                        onChange={(ref, foolValue) => {
                                            this.setState({
                                                defaultvalueObj: foolValue
                                                // defaultvalueObj: {...ref, ...foolValue}//艺轩参照传值
                                            });
                                        }}
                                        functions={[{
                                            name: langCheck('ZoneSetting-000026', 'pages', json),/* 国际化处理： 默认主组织*/
                                            code: '#mainorg#'
                                        }, {
                                            name: langCheck('ZoneSetting-000027', 'pages', json),/* 国际化处理： 当前操作员*/
                                            code: '#operator#'
                                        }]}
                                    />
                            );
                        } else {
                            utilService.createScript.call(
                                this,
                                //参照默认取值相对路径改为绝对路径
                                `${this.state.refcode}`
                            );
                        }
                    })()}
                </div>
            </Modal>
        );
    }
}

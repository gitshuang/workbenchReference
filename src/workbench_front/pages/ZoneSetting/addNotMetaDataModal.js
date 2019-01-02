import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { Input, Modal, Button } from "antd";
import { updateAreaList } from "Store/ZoneSetting/action";
import { langCheck } from 'Pub/js/utils';
//添加非元数据模态框组件类
class AddNotMetaDataModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notMetaDataName: "",
            notMetaDataCode: "",
            explainForName: "",
            explainForCode: ""
        };
    }
    //设置新增非元数据模态框隐藏
    showModalHidden = () => {
        this.props.setAddDataModalVisibel(false);
        //弹窗关闭后需要清空弹窗数据
        this.setState({
            notMetaDataName: "",
            notMetaDataCode: "",
            explainForName: "",
            explainForCode: ''
        })
    };
    //点击确定按钮
    onOkDialog = () => {
        //确定之前先判断弹出框是否正确输入数据
        let flag = true;
        const { notMetaDataName, notMetaDataCode } = this.state;
        let { json } = this.props;
        if (
            this.checkDataCorrect(notMetaDataName).correct &&
            this.checkDataCorrect(notMetaDataCode, "code").correct
        ) {
            flag = false;
        }
        if(flag) {
            if(notMetaDataName == '') {
                this.setState({
                    explainForName: langCheck('ZoneSetting-000000', 'pages', json)/* 国际化处理： 不能为空*/
                })
            }
            if(notMetaDataCode == '') {
                this.setState({
                    explainForCode: langCheck('ZoneSetting-000000', 'pages', json)/* 国际化处理： 不能为空*/
                })
            }
            return;
        }
        //
        let { areaList, areaIndex } = this.props;
        let queryPropertyList = areaList[areaIndex].queryPropertyList;
        let cardObj = {};
        if (this.props.areatype === "0") {
            //查询区
            cardObj = {
                pk_query_property: "newNotMetaData" + new Date().getTime(),
                areaid: areaList[areaIndex].pk_area,
                label: this.state.notMetaDataName,
                code: this.state.notMetaDataCode,
                metapath: "",
                isnotmeta: true,
                isuse: true,
                position: `${queryPropertyList.length + 1}`,
                opersign: "=@>@>=@<@<=@like@",
                opersignname: langCheck('ZoneSetting-000001', 'pages', json),/* 国际化处理： 等于@大于@大于等于@小于@小于等于@相似@*/
                defaultvalue: "",
                isfixedcondition: false,
                required: false,
                disabled: false,
                visible: true,
                ismultiselectedenabled: false,
                isquerycondition: false,
                datatype: "1",
                refname: "-99",
                containlower: false,
                ischeck: false,
                isbeyondorg: false,
                usefunc: false,
                showtype: "1",
                returntype: "refpk",
                define1: "",
                define2: "",
                define3: "",
                define4: "",
                define5: "",
                itemtype: "input",
                visibleposition: "",
                tablecode: "",
                querytablename: ""
            };
        } else {
            //非查询区
            cardObj = {
                pk_query_property: "newNotMetaData" + new Date().getTime(),
                areaid: areaList[areaIndex].pk_area,
                code: this.state.notMetaDataCode,
                datatype: "1",
                label: this.state.notMetaDataName,
                position: `${queryPropertyList.length + 1}`,
                metapath: "",
                color: "#111111",
                isrevise: false,
                required: false,
                disabled: false,
                visible: true,
                maxlength: "20",
                defaultvalue: "",
                hyperlinkflag: false,//超链接
                defaultvar: "",
                define1: "",
                define2: "",
                define3: "",
                itemtype: "input"
            };
        }
        if (this.props.areatype === "1") {
            //表单
            cardObj.colnum = "1";
            cardObj.isnextrow = false;
        }
        if (this.props.areatype === "2") {
            //表格
            cardObj.width = "";
            cardObj.istotal = false;
        }
        areaList[areaIndex].queryPropertyList = queryPropertyList.concat(
            cardObj
        );
        this.setState({
            notMetaDataName: "",
            notMetaDataCode: "",
            explainForName: "",
            explainForCode: ""
        });
        this.props.updateAreaList(areaList);
        this.showModalHidden();
    };
    /**
     * 检查code是否已经存在，从而判断code唯一性
     * @param {String} checkCode 待检查的code文本
     * @return {Boolean} flag 是否存在/唯一
     */
    isUniqueInQueryList = checkCode => {
        let { areaList, areaIndex } = this.props;
        let queryPropertyList = areaList[areaIndex].queryPropertyList;
        let flag = true;
        _.forEach(queryPropertyList, q => {
            if (q.code === checkCode) {
                flag = false;
                return false;
            }
        });
        return flag;
    };
    /**
     * 检查数据是否正确
     * @param {String} checkedStr 待检查的文本
     * @param {String} type 待查文本的归属属性
     * @return {Object} 是否正确&错误数据提示
     */
    checkDataCorrect = (checkedStr, type) => {
        let correct = true;
        let errorMsg = "";
        let { json } = this.props;
        if (type === "code") {
            if (checkedStr === "") {
                errorMsg = langCheck('ZoneSetting-000000', 'pages', json);/* 国际化处理： 不能为空*/
                correct = false;
            } else {
                //含中文正则
                let strRegExp = /[\u4e00-\u9fa5]/;
                if (strRegExp.test(checkedStr)) {
                    errorMsg = langCheck('ZoneSetting-000002', 'pages', json);/* 国际化处理： 不能为中文*/
                    correct = false;
                }
                if (!this.isUniqueInQueryList(checkedStr)) {
                    errorMsg = langCheck('ZoneSetting-000003', 'pages', json);/* 国际化处理： 不能编码重复*/
                    correct = false;
                }
            }
        } else {
            if (checkedStr === "") {
                errorMsg = langCheck('ZoneSetting-000000', 'pages', json);/* 国际化处理： 不能为空*/
                correct = false;
            }
        }
        return { correct: correct, errorMsg: errorMsg };
    };
    /**
     * 检查name和code都正确
     * @return {Boolean} 是否都正确
     */
    checkNameAndCodeCorrect = () => {
        let flag = false;
        const { notMetaDataName, notMetaDataCode } = this.state;
        if (
            this.checkDataCorrect(notMetaDataName).correct &&
            this.checkDataCorrect(notMetaDataCode, "code").correct
        ) {
            flag = true;
        }
        return flag;
    };
    //回车键事件
    onPressEnter = () => {
        if (!this.checkNameAndCodeCorrect()) {
            return;
        }
        this.onOkDialog();
    };
    //修改非元数据名称
    changeNotMetaDataName = e => {
        this.setState({ notMetaDataName: e.target.value });
        const { correct, errorMsg } = this.checkDataCorrect(e.target.value);
        this.setState({ explainForName: errorMsg });
    };
    //修改非元数据编码
    changeNotMetaDataCode = e => {
        this.setState({ notMetaDataCode: e.target.value });
        const { correct, errorMsg } = this.checkDataCorrect(
            e.target.value,
            "code"
        );
        this.setState({ explainForCode: errorMsg });
    };
    //当非元数据模态框状态，弹出时（状态由不显示=>显示），则文本框自动获得焦点
    componentWillUpdate = (nextProps, nextState) => {
        if (!this.props.addDataModalVisibel && nextProps.addDataModalVisibel) {
            setTimeout(() => {
                this.refs.addNotMetaDataInputDom.focus();
            }, 0);
        }
    };
    render() {
        let { json } = this.props;
        return (
            <Modal
                maskClosable={false}
                title={langCheck('ZoneSetting-000004', 'pages', json)}/* 国际化处理： 新增非元数据*/
                mask={false}
                wrapClassName="vertical-center-modal add-not-meta-data"
                visible={this.props.addDataModalVisibel}
                onOk={this.onOkDialog}
                onCancel={this.showModalHidden}
                footer={[
                    <Button
                        key="submit"
                        // disabled={!this.checkNameAndCodeCorrect()}
                        type="primary"
                        onClick={this.onOkDialog}
                    >
                        {langCheck('ZoneSetting-000005', 'pages', json)}
                        {/* /* 国际化处理： 确定*/ }
                    </Button>,
                    <Button key="back" onClick={this.showModalHidden}>
                        {langCheck('ZoneSetting-000006', 'pages', json)}
                        {/* /* 国际化处理： 取消*/}
                    </Button>
                ]}
            >
                <div>
                    <div 
                        className="code-div" 
                        ref="addNotMetaCodeDiv"
                        style={ this.state.explainForCode === ""
                            ? {marginBottom: '19.09px'}
                            : {}
                        }
                        >
                        <span>{langCheck('ZoneSetting-000007', 'pages', json)}</span>
                        {/* /* 国际化处理： 非元数据编码*/ }
                        <Input
                            className={
                                this.state.explainForCode === ""
                                    ? ""
                                    : "has-error"
                            }
                            ref="addNotMetaDataInputDom"
                            placeholder={langCheck('ZoneSetting-000008', 'pages', json)}/* 国际化处理： 请输入非元数据编码，非中文*/
                            value={this.state.notMetaDataCode}
                            onChange={this.changeNotMetaDataCode}
                            onPressEnter={this.onPressEnter}
                        />
                        <br/>
                        <div
                            style={{
                                marginLeft: '26%',
                                visibility:
                                    this.state.explainForCode === ""
                                        ? "hidden"
                                        : "visible"
                            }}
                            className="form-explain"
                        >
                            {this.state.explainForCode}
                        </div>
                    </div>
                    <div 
                        ref="addNotMetaNameDiv" 
                        className='not-code'
                        style={ this.state.explainForName === ""
                            ? {marginBottom: '19.09px'}
                            : {}
                        }
                    >
                        <span>{langCheck('ZoneSetting-000009', 'pages', json)}</span>
                        {/* /* 国际化处理： 非元数据名称*/ }
                        <Input
                            className={
                                this.state.explainForName === ""
                                    ? ""
                                    : "has-error"
                            }
                            placeholder={langCheck('ZoneSetting-000010', 'pages', json)}/* 国际化处理： 请输入非元数据名称*/
                            value={this.state.notMetaDataName}
                            onChange={this.changeNotMetaDataName}
                            onPressEnter={this.onPressEnter}
                        />
                        <br/>
                        <div
                            style={{
                                marginLeft: '26%',
                                visibility:
                                    this.state.explainForName === ""
                                        ? "hidden"
                                        : "visible"
                            }}
                            className="form-explain"
                        >
                            {this.state.explainForName}
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
export default connect(
    state => ({
        areaList: state.zoneSettingData.areaList
    }),
    {
        updateAreaList
    }
)(AddNotMetaDataModal);

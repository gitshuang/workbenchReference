import React, { Component } from "react";
import { connect } from "react-redux";
import "./index.less";
import MyHeader from "./header";
import MyContent from "./content";
import MyRightSider from "./rightSider";
import { Steps } from "antd";
import { GetQuery, langCheck } from "Pub/js/utils";
import { getMulti } from 'Pub/js/getMulti';
const Step = Steps.Step;
//模板配置首页
class ZoneSetting extends Component {
    constructor(props) {
        super(props);
        this.urlRequestObj = GetQuery(this.props.location.search);
        console.log('this.props.location.search', this.props.location.search);
        this.state = {
            templetid: this.urlRequestObj.templetid,
            status: this.urlRequestObj.status, // status
            pcode: this.urlRequestObj.pcode,
            appcode: this.urlRequestObj.appcode,
            json: {},
            isLang:false
        };
    }
    componentWillMount(){
        let callback = (json) => {
            // console.log('json', json);
            window.multiZoneSettingLang = json;
            this.setState({
                json:json,
                isLang:true
            });
        };
        getMulti({
            moduleId: 'ZoneSetting',
            // currentLocale: 'zh-CN',
            domainName: 'workbench',
            callback
        });
    }
    //多语
	componentDidMount() {
		// let callback = (json) => {
        //     // console.log('json', json);
        //     // window.multiZoneSettingLang = json;
        //     this.setState({
        //         json:json,
        //         isLang:true
        //     });
        // };
        // getMulti({
        //     moduleId: 'ZoneSetting',
        //     // currentLocale: 'zh-CN',
        //     domainName: 'workbench',
        //     callback
        // });
	}
    render() {
        let { json } = this.state;
        console.log('pcode', this.state.pcode);/* 国际化处理： 实施态pcode,实施态*/
        console.log('appcode', this.state.appcode);/* 国际化处理： 实施态appcode,实施态*/
		//实时态，status控制steps是否显示
        let show = this.urlRequestObj.status
            ? "display_none"
            : "template-setting-steps";
        return (
            <div className="template-setting-page">
                <div className={show}>
                    <Steps size="small" current={1}>
                        <Step title={langCheck('ZoneSetting-000052', 'pages', json)} description={langCheck('ZoneSetting-000053', 'pages', json)} />
                        {/* /* 国际化处理： 设置页面基本信息,已完成*/}
                        <Step title={langCheck('ZoneSetting-000035', 'pages', json)} description={langCheck('ZoneSetting-000054', 'pages', json)} />
                        {/* /* 国际化处理： 配置模板区域,进行中*/}
                        <Step title={langCheck('ZoneSetting-000055', 'pages', json)} description="" />
                        {/* /* 国际化处理： 配置完成*/}
                    </Steps>
                </div>
                <MyHeader
                    templetid={this.state.templetid}
                    status={this.state.status}
                    pcode={this.state.pcode}
                    appcode={this.state.appcode}
                    json={this.state.json}
                />
                <div className="template-setting-container">
                    <MyContent
                        templetid={this.state.templetid}
                        status={this.state.status}
                        json={this.state.json}
                    />
                    {
                        this.state.isLang?(<MyRightSider json={this.state.json}/>):null
                    }
                </div>
            </div>
        );
    }
}
export default connect(
    state => ({}),
    {}
)(ZoneSetting);

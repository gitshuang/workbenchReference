import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import './index.less';
import withDragDropContext from 'Pub/js/withDragDropContext';
//自定义组件
import MySider from './sider';
import MyContent from './content';
import {GetQuery} from 'Pub/js/utils';
import { connect } from 'react-redux';
import * as utilService from './utilService';
import { updateGroupList,clearData,initGroups,setJson } from 'Store/test/action';
import Notice from 'Components/Notice';
import CustomDragLayer from './customDragLayer';
import { getMulti } from 'Pub/js/getMulti';
class Test extends Component {
	constructor(props) {
		super(props);
		//获得url中的参数
		const urlRequestObj = GetQuery(this.props.location.search);
		const relateidObj = utilService.getRelateidObj(urlRequestObj.pk_responsibility, urlRequestObj.is_group)
		this.state = {
			relateidObj:relateidObj
		};
	}
	//清除redux
	componentWillUnmount() {
		this.props.clearData();
		window.onbeforeunload = null;
		// window.removeEventListener("beforeunload", this.loadPage);
	}
	// beforeunload = () => {
	// 	//关闭浏览器提示信息
	// 	window.onbeforeunload = function (e) {
	// 		e = e || window.event;
	// 		var y = e.clientY;
	// 		if (y <= 0 || y >= Math.max(document.body ? document.body.clientHeight : 0, document.documentElement ? document.documentElement.clientHeight : 0))
	// 		{
	// 			//IE 和 Firefox 
	// 			// alert("IE or Firefox");
	// 			e.returnValue = "确定要刷新或关闭浏览器窗口？";
	// 		}
	// 		//谷歌		
	// 		// console.log("beforeclosing");
	// 		return "确定要刷新或关闭浏览器窗口？";			 
	// 	}
	// }

	loadPage = (e) => {
		var confirmationMessage = "";
		(e || window.event).returnValue = confirmationMessage;   //Gecko + IE
		return confirmationMessage;   //Webkit, Safari, Chrome etc.
	}
	componentWillMount(){
		window.onbeforeunload = this.loadPage;//dom2的方式添加方法，windows不能直接删掉
	}
	componentDidMount() {
		// window.addEventListener("beforeunload", this.loadPage);
		
		let callback = (json) => {
			// console.log(json);
            this.props.setJson(json);
        };
        getMulti({
            moduleId: 'DesktopSetting',
            // currentLocale: 'zh-CN',
            domainName: 'workbench',
            callback  
        });

		let ajaxData = {
			isuser: this.state.relateidObj.code //0职责 1用户 2集团
		};
		if(this.state.relateidObj.code === '0'){
			ajaxData.relateid = this.state.relateidObj.data;
		}
		Ajax({
			url: `/nccloud/platform/appregister/queryworkbench.do`,
			info: {
				name:this.props.json['DesktopSetting-000004'],/* 国际化处理： 工作桌面配置*/
				action:this.props.json['DesktopSetting-000024']/* 国际化处理： 工作桌面查询*/
			},
			data: ajaxData,
			success: (res) => {
				if (res) {
					let { data, success } = res.data;
					if (success && data&& data.length > 0 ) {
							//数据的初始化
							_.forEach(data[0].groups, (g) => {
								g.type = "group";
								_.forEach(g.apps,(a)=>{
									a.isShadow = false;
									a.isChecked = false;
									a.apptype = Number(a.apptype);
									a.gridx = Number(a.gridx);
									a.gridy = Number(a.gridy);
									a.height = Number(a.height);
									a.width = Number(a.width);
								})
							});
							this.props.updateGroupList(data[0].groups);
							this.props.initGroups(data[0].groups);
						}else{
							if(success && data && data.length === 0){
								// Notice({ status: 'warning', msg: this.props.json['DesktopSetting-000025'] });/* 国际化处理： 工作桌面为空，请配置*/
							}else{
								Notice({ status: 'error', msg: data });
							}
						}
				}
			}
		});
	}
	
	render() {
		return (
			<div className="nc-desktop-setting">
					<MySider relateidObj={this.state.relateidObj}/>
					<MyContent relateidObj={this.state.relateidObj} unLoad={this.loadPage}/>
					{/* 子组件传方法 */}
					<CustomDragLayer/>
			</div>
		);
	}
}
export default connect(
	(state) => ({
		json: state.templateDragData.json,
		//多语redux获取数据
	}),
	{
		updateGroupList,
		clearData,
		initGroups,
		setJson
		//多语redux存贮数据
	}
)(withDragDropContext(Test));
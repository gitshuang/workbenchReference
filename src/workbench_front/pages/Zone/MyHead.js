import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Steps } from 'antd';
import { connect } from 'react-redux';
const { Header } = Layout;
import { langCheck } from 'Pub/js/utils';
const Step = Steps.Step;

/**
 * 工作桌面 完成步骤 
 */
class MyHead extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siderHeight: '280',
			state:'browse'
		};
	}
	render() {
		let {json}=this.props;
		return ( 
		<Header>
				<div className='template-setting-steps'>
					<Steps size='small' current={0}>
						<Step title={langCheck('102202APP-000027', "pages", json)} description={langCheck('102202APP-000028', "pages", json)} />{/* 国际化处理： 设置页面基本信息,进行中*/}
						<Step title={langCheck('102202APP-000029', "pages", json)} description='' />{/* 国际化处理： 配置模板区域*/}
						<Step title={langCheck('102202APP-000030', "pages", json)} description='' />{/* 国际化处理： 配置完成*/}
					</Steps>
				</div>
	   </Header>
			   );
	     }
}
export default connect(
	(state) => ({
		zoneState: state.AppRegisterData.zoneState,
		getFromData: state.AppRegisterData.getFromData,
		json:state.zoneRegisterData.json
	}),
	{
	}
)(MyHead);

import React, { Component } from 'react';
import MyHeader from './header';
import MyContent from './content';
import './index.less';
import { Steps } from 'antd';
import {GetQuery, langCheck} from 'Pub/js/utils';
import { getMulti } from 'Pub/js/getMulti';

const Step = Steps.Step;

class ZoneSetting extends Component {
	constructor(props) {
		super(props);
		const urlRequestObj = GetQuery(this.props.location.search);
		
		this.state = {
			templetid :urlRequestObj.templetid,
			json: {}
		};
	}
	componentWillMount() {}
	//多语
	componentDidMount() {
		let callback = (json) => {
			// console.log('json', json);
            this.setState({
                json:json
            });
        };
        getMulti({
            moduleId: 'ZoneSettingComplete',
            // currentLocale: 'zh-CN',
            domainName: 'workbench',
            callback
        });
	}

	render() {
		let { json } = this.state;
		return (
			<div className='template-setting-complete-page'>
				<div className='template-setting-steps'>
					<Steps size='small' current={2}>
						<Step title={langCheck('ZoneSettingComplete-000008', 'pages', json)} description={langCheck('ZoneSettingComplete-000009', 'pages', json)} />
						{/* /* 国际化处理： 设置页面基本信息,已完成*/ }
						<Step title={langCheck('ZoneSettingComplete-000010', 'pages', json)} description={langCheck('ZoneSettingComplete-000009', 'pages', json)} />
						{/* /* 国际化处理： 配置模板区域,已完成*/ }
						<Step title={langCheck('ZoneSettingComplete-000007', 'pages', json)} description={langCheck('ZoneSettingComplete-000009', 'pages', json)} />
						{/* /* 国际化处理： 配置完成,已完成*/ }
					</Steps>
				</div>
				<MyHeader  json={this.state.json}/>
				<div className='template-setting-container'>
					<MyContent templetid={this.state.templetid} json={this.state.json}/>
				</div>
			</div>
		);
	}
}
export default ZoneSetting;

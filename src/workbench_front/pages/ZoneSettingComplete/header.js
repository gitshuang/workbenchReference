import React, { Component } from 'react';
import { langCheck } from 'Pub/js/utils';

class MyHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let { json } = this.props;
		return (
			<div className='template-setting-header'>
				<div className='header-name'>
					<span>{langCheck('ZoneSettingComplete-000007', 'pages', json)}</span>
					{/* /* 国际化处理： 配置完成*/ }
				</div>
			</div>
		);
	}
}
export default MyHeader;

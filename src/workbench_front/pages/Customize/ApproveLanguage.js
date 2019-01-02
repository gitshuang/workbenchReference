import React, { Component } from 'react';
import { Button } from 'antd';
import ComLayout from './ComLayout';
import {langCheck} from "Pub/js/utils.js";
class ApproveLanguage extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		let { json } = this.props;
		return (
			<ComLayout
				className="approvelanguage"
				title={this.props.title}
				headerOther={<Button type="primary">{langCheck('Customize-000012', 'pages', json)}</Button>}/* 国际化处理： 新增*/
			>
				<div>222</div>
			</ComLayout>
		);
	}
}
export default ApproveLanguage;

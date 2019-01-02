import React, { Component } from 'react';
/**
 * 个性化设置页面布局
 */
class ComLayout extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className={`customize-page ${this.props.className ? this.props.className : ''}`}>
				<div className="customize-content">{this.props.children}</div>
			</div>
		);
	}
}
export default ComLayout;

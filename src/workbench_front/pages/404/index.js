import React, { Component } from 'react';
import PageLayout from 'Components/PageLayout';
export default class NotFound extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		let { location } = this.props;
		return (
			<PageLayout>
				<h3>
					Not Found <code>{location.pathname}</code>
				</h3>
			</PageLayout>
		);
	}
}

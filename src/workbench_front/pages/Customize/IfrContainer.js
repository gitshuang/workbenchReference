import React, { Component } from "react";
import { langCheck } from "Pub/js/utils.js";
class IfrContainer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { json } =this.props;
        return (
            <div className="customize-iframe">
                <iframe
                    field="customize-iframe"
                    fieldname={langCheck('Customize-000043', 'pages', json)/* 国际化处理： "个性化主框架"*/}
                    id="customizeiframe"
                    src={this.props.ifr}
                    frameBorder="0"
                    scrolling="yes"
                />
            </div>
        );
    }
}
export default IfrContainer;

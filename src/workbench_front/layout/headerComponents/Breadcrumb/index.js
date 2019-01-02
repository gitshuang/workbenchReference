import React, { Component } from "react";
import { Breadcrumb as Bc } from "antd";
import { withRouter } from "react-router-dom";
import { GetQuery, langCheck } from "Pub/js/utils";
import "./index.less";
class Breadcrumb extends Component {
    constructor(props) {
        super(props);
    }
    handleHomeClick = () => {
        this.props.history.push("/");
    };

    render() {
        let { b1, b2, b3, n } = GetQuery(this.props.location.search);
        return (
            <div className="workbench-breadcrumb">
                {/* <i
                    field="home-icon" 
                    fieldname="主页"
                    className="iconfont icon-zhuye"
                    onClick={this.handleHomeClick}
                /> */}
                <Bc
                    separator={
                        <i className="iconfont icon-mianbaoxie font-size-12" />
                    }
                >
                    <Bc.Item onClick={this.handleHomeClick}>{langCheck('0000PUB-000105')}</Bc.Item>{/* 国际化处理： 首页*/}
                    <Bc.Item>
                        {b1 === "undefined" || b1 === "null" ? null : b1}
                    </Bc.Item>
                    <Bc.Item>
                        {b2 === "undefined" || b2 === "null" ? null : b2}
                    </Bc.Item>
                    <Bc.Item>
                        {b3 === "undefined" || b3 === "null" ? null : b3}
                    </Bc.Item>
                    <Bc.Item>
                        {n === "undefined" || n === "null" ? null : n}
                    </Bc.Item>
                </Bc>
            </div>
        );
    }
}
export default withRouter(Breadcrumb);

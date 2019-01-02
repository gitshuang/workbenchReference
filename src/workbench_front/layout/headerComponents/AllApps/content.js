import React, { Component } from "react";
import "./index.less";

class MyContent extends Component {
    constructor(props) {
        super(props);
    }
    //渲染右侧应用菜单信息
    render() {
        const { contentData } = this.props;
        return (
            <div className="content">
                {contentData.map((c, index) => {
                    return (
                        <div className="content-item" key={index}>
                            <div className="content-item-header">
                                <strong>{c.label}</strong>
                            </div>
                            <div className="content-item-content">
                                {c.children.map((child, i) => {
                                    return (
                                        <div className="item-app" key={i}>
                                            <a
                                                href="javascript:void(0);"
                                                onClick={() => {
                                                    window.openNew(child);
                                                }}
                                            >
                                                {child.label}
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}
export default MyContent;

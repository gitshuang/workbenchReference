import React, { Component } from "react";
import { Button } from "antd";
import { openPage } from "Pub/js/superJump";
import { langCheck } from "Pub/js/utils";
import emptycontentImg from "Assets/images/emptycontent.png";
class EmptyContent extends Component {
    constructor(props) {
        super(props);
    }
    pageToHome = () => {
        openPage(
            "/ds",
            false,
            {
                n: "桌面设置"
            },
            ["b1", "b2", "b3"]
        );
    };
    render() {
        let { multiData } = this.props;
        return (
            <div className="nc-workbench-home-empty">
                <div className="empty-content">
                    <h1>{langCheck("home-000003", true, multiData)}</h1>
                    <p>{langCheck("home-000004", true, multiData)}</p>
                    <div
                        className="empty-img"
                        style={{
                            width: "264px",
                            height: "214px",
                            background: `url(${emptycontentImg}) no-repeat 0px 0px`,
                            backgroundSize: "contain"
                        }}
                    />
                    <div className="empty-btn">
                        <Button
                            className="empty-button"
                            onClick={this.pageToHome}
                        >
                            +{langCheck("home-000005", true, multiData)}
                        </Button>
                    </div>
                    {/* <ul>
                        <li>如何添加？</li>
                        <li>
                            1.前往个人中心 ,点击{" "}
                            <span onClick={this.pageToHome}>
                                <i className="iconfont icon-gerenpeizhi" />
                                桌面设置
                            </span>
                        </li>
                        <li>2.新增分组后 ，拖拽应用至右侧</li>
                    </ul> */}
                </div>
            </div>
        );
    }
}
export default EmptyContent;

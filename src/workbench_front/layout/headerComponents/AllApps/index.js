import React, { Component } from "react";
import Ajax from "Pub/js/ajax";
import {langCheck} from "Pub/js/utils";
import "./index.less";
import MyContent from "./content";

class AllApps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appGroupArr: [],
            contentData: [],
            isSelectModuleID: 0,
            json: {}
        };
    }
    componentDidMount() {
        Ajax({
            url: `/nccloud/platform/appregister/queryapplazy.do`,
            info: {
                name: langCheck('0000PUB-000101'),/* 国际化处理： 所有应用*/
                appcode: "10228888",
                action: langCheck('0000PUB-000102')/* 国际化处理： 查询一二级领域模块*/
            },
            data: {
                apptype: "1"
            },
            success: res => {
                const { data, success } = res.data;
                if (success && data && data.length > 0) {
                    if (data[0].children && data[0].children[0].value) {
                        this.setModuleSelect(data[0].children[0].value);
                    }
                    this.setState({ appGroupArr: data });
                }
            }
        });
    }
    //选择模块
    setModuleSelect = moduleID => {
        this.setState({ isSelectModuleID: moduleID });
        Ajax({
            url: `/nccloud/platform/appregister/queryapplazy.do`,
            info: {
                name: langCheck('0000PUB-000101'),/* 国际化处理： 所有应用*/
                appcode: "10228888",
                action: langCheck('0000PUB-000103')/* 国际化处理： 查询模块下应用*/
            },
            data: {
                own_module: moduleID,
                apptype: "1"
            },
            success: res => {
                const { data, success } = res.data;
                if (success && data && data.length > 0) {
                    this.setState({ contentData: data });
                }
                //如果返回数组为空的页面也显示为空
                if (success && data && data.length == 0) {
                    this.setState({ contentData: [] });
                }
            }
        });
    };
    //渲染左侧分组
    siderGroup = () => {
        return this.state.appGroupArr.map((item, index) => {
            return (
                <div className="result-group-list" key={index}>
                    <h4 className="result-header">
                        <span className="result-header-name">{item.label}</span>
                    </h4>
                    <div className="result-app-list">
                        {item.children.map((child, i) => {
                            return (
                                <div className="app-col" key={i}>
                                    <div className="list-item">
                                        <div
                                            className={
                                                this.state.isSelectModuleID ===
                                                child.value
                                                    ? "list-item-content active"
                                                    : "list-item-content"
                                            }
                                            onClick={() => {
                                                this.setModuleSelect(
                                                    child.value
                                                );
                                            }}
                                        >
                                            <div
                                                className={
                                                    this.state
                                                        .isSelectModuleID ===
                                                    child.value
                                                        ? "title active"
                                                        : "title"
                                                }
                                            >
                                                <span>{child.label}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        });
    };

    render() {
        const siderGroup = this.siderGroup();
        return (
            <div className="all-apps-layout">
                <div className="sider">{siderGroup}</div>
                <MyContent contentData={this.state.contentData} />
            </div>
        );
    }
}
export default AllApps;

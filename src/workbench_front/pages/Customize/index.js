import React, { Component } from "react";
import {
    PageLayout,
    PageLayoutHeader,
    PageLayoutLeft,
    PageLayoutRight
} from "Components/PageLayout";
import MenuList from "./MenuList";
import { high } from "nc-lightapp-front";
import Loadable from "react-loadable";
import Loading from "Components/Loading";
import Ajax from "Pub/js/ajax";
import "./index.less";
import { getMulti } from 'Pub/js/getMulti';
import { langCheck } from "Pub/js/utils.js";
const { Refer } = high;
const DefaultSetting = Loadable({
    loader: () => import("./DefaultSetting"),
    loading: Loading
});
const AgentSetting = Loadable({
    loader: () => import("./AgentSetting"),
    loading: Loading
});
const CommonData = Loadable({
    loader: () => import("./CommonData"),
    loading: Loading
});
const IfrContainer = Loadable({
    loader: () => import("./IfrContainer"),
    loading: Loading
});
class Customize extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: "default",
            listArray: [],
            json:{}
        };
    }
    /**
     * 个性化页面页面
     * @param {String} key 菜单标识
     */
    hanleMenuListClick = key => {
        console.log(key);
        let { listArray } = this.state;
        // 为选中list 项添加 活跃标识
        listArray = listArray.map((item, index) => {
            delete item.active;
            if (item.url === key) {
                item.active = true;
            }
            return item;
        });
        this.setState({ listArray, activeKey: key });
    };
    /**
     *
     */
    loadCom = key => {
        let { json } = this.state;
        switch (key) {
            case "default":
                return <DefaultSetting title={langCheck('Customize-000039', 'pages', json)} json={json} />;/* 国际化处理： 默认设置*/
            case "agent":
                return <AgentSetting title={langCheck('Customize-000041', 'pages', json)} json={json} />; /* 国际化处理： 代理人设置*/
            case "commonData":
                return <CommonData title={langCheck('Customize-000027', 'pages', json)} />;        /* 国际化处理： 常用数据*/
            default:
                // let listItem = this.state.listArray.find((item)=>item.page_part_url === key);
                return <IfrContainer ifr={key} json={json} />;
        }
    };
    pageback = () => {
        this.props.history.push("/");
    };
    componentDidMount() {
        let { json } = this.state;
        let callback = (json) => {
            this.setState({
                json:json
            });
        };
        getMulti({
            moduleId: 'Customize',
            // currentLocale: 'zh-CN',
            domainName: 'workbench',
            callback
		});
        Ajax({
            url: `/nccloud/platform/appregister/queryindividualreg.do`,
            info: {
                name: langCheck('Customize-000042', 'pages', json),/* 国际化处理： 个性化*/
                action: langCheck('Customize-000005', 'pages', json)/* 国际化处理： 查询*/
            },
            success: ({ data: { data } }) => {
                if (data) {
                    let listArray = data.map((item, index) => {
                        if (index === 0) {
                            return {
                                active: true,
                                name: item.name,
                                code: item.code,
                                url: item.page_part_url
                            };
                        }
                        return {
                            name: item.name,
                            code: item.code,
                            url: item.page_part_url
                        };
                    });
                    this.setState({ listArray });
                }
            }
        });
    }
    render() {
        let { listArray,json } = this.state;
        return (
            <PageLayout
                className="customize-layout"
                header={
                    <PageLayoutHeader>
                        <div>
                            <i
                                className="iconfont icon-fanhuishangyiji"
                                onClick={this.pageback}
                            />
                            {langCheck('Customize-000031', 'pages', json)/* 国际化处理： 个性化设置*/}
                        </div>
                    </PageLayoutHeader>
                }
            >
                <PageLayoutLeft>
                    <div className="customize-left workbench-scroll">
                        {listArray.length > 0 ? (
                            <MenuList
                                onClick={this.hanleMenuListClick}
                                listArray={listArray}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                </PageLayoutLeft>
                <PageLayoutRight>
                    {listArray.length > 0
                        ? this.loadCom(this.state.activeKey)
                        : ""}
                </PageLayoutRight>
            </PageLayout>
        );
    }
}
export default Customize;

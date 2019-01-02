import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Drawer from "react-motion-drawer";
import { changeDrawer } from "Store/appStore/action";
import { openPage } from "Pub/js/superJump";
import Notice from "Components/Notice";
import Ajax from "Pub/js/ajax";
import { langCheck } from "Pub/js/utils";
import { sprLog } from "./headerComponents/spr";
import { CancelPrompts } from "Components/EventPrompts";
import AccountActivation from "Components/AccountActivation";
/**
 * workbench 工作桌面头像侧拉内容集合
 */
class SideDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sprType: true
        };
    }
    handleDrawerChange = isOpen => {
        this.props.changeDrawer(isOpen);
    };
    /**
     * 侧边栏当前页跳转页面
     * 采用单页路由方式
     * @param {Object} param 跳转目标页需要传递的参数
     * @param {String} uri 跳转目标页面路由
     */
    handeleSkipPage = (uri, param) => {
        let { isOpen } = this.props;
        openPage(uri, false, param, ["b1", "b2", "b3"]);
        this.props.changeDrawer(!isOpen);
    };
    logout = () => {
        Ajax({
            url: `/nccloud/platform/logout/logoutyhtanddiwork.do`,
            info: {
                name: langCheck("0000PUB-000109") /* 国际化处理： 工作桌面*/,
                appcode: "10228888",
                action: langCheck("0000PUB-000140") /* 国际化处理： 注销*/
            },
            success: ({ data: { data } }) => {
                let logoutIframe = document.createElement("iframe");
                logoutIframe.setAttribute("src", data);
                logoutIframe.style.width = "1px";
                logoutIframe.style.height = "1px";
                logoutIframe.frameBorder = "0";
                logoutIframe.scrolling = "no";
                document.body.appendChild(logoutIframe);
                Ajax({
                    url: `/nccloud/riart/login/logout.do`,
                    info: {
                        name: langCheck(
                            "0000PUB-000109"
                        ) /* 国际化处理： 工作桌面*/,
                        appcode: "10228888",
                        action: langCheck(
                            "0000PUB-000140"
                        ) /* 国际化处理： 注销*/
                    },
                    success: () => {
                        Ajax({
                            url: `/nccloud/platform/appregister/querypersonsettings.do`,
                            info: {
                                name: langCheck(
                                    "0000PUB-000109"
                                ) /* 国际化处理： 工作桌面*/,
                                appcode: "10228888",
                                action: langCheck(
                                    "0000PUB-000140"
                                ) /* 国际化处理： 注销*/
                            }
                        });
                        sessionStorage.removeItem("gzip");
                    }
                });
            }
        });
    };
    /**
     * 注销操作
     */
    handleExit = () => {
        this.props.changeDrawer(false);
        CancelPrompts(
            () => {
                window.onbeforeunload = null;
                window.proxyAction(
                    this.logout,
                    this,
                    langCheck("0000PUB-000140")
                )({ logout: true }); /* 国际化处理： 注销*/
            },
            langCheck("0000PUB-000140") /* 国际化处理： 注销*/,
            langCheck(
                "0000PUB-000141"
            ) /* 国际化处理： 注销当前账号？,注销当前账号*/
        );
    };
    /**
     * spr录制
     */
    handleSprClick = () => {
        let { sprType } = this.state;
        sprType = sprLog(sprType, sprType => {
            this.setState({ sprType });
        });
    };
    /**
     * 联系用友服务人员
     */
    sysinitAccessorAction = () => {
        let win = window.open("", "_blank");
        let { hostname, port, protocol } = window.location;
        Ajax({
            url: `/nccloud/platform/login/loginism.do`,
            data: {
                ip: hostname,
                port: port.length > 0 ? port : "80"
            },
            info: {
                name: langCheck("0000PUB-000105") /* 国际化处理： 首页*/,
                appcode: "10228888",
                action: langCheck(
                    "0000PUB-000142"
                ) /* 国际化处理： 联系服务人员*/
            },
            success: ({ data: { data } }) => {
                if (data) {
                    win.location.href = `${protocol}//${data}`;
                } else {
                    win.close();
                    Notice({
                        status: "error",
                        msg: langCheck(
                            "0000PUB-000143"
                        ) /* 国际化处理： 请联系系统管理员配置本地ism服务器ip地址！*/
                    });
                }
            }
        });
    };

    render() {
        let { isOpen, avatar } = this.props;
        let { sprType } = this.state;
        return (
            <div className="nc-workbench-drawer">
                <Drawer
                    className="drawer-content"
                    width={430}
                    overlayColor={"none"}
                    drawerStyle={{
                        top: "48px",
                        border: "1px solid rgba(78, 89, 104, 0.19)",
                        boxShadow: "3px 6px 8px 0px rgba(74,81,93,0.25)",
                        borderRadius: "2px 3px 3px 0px"
                    }}
                    open={isOpen}
                    onChange={this.handleDrawerChange}
                >
                    <div className="drawer-exit" onClick={this.handleExit}>
                        <i
                            field="logout"
                            fieldname={langCheck(
                                "0000PUB-000140"
                            )} /* 国际化处理： 注销*/
                            title={langCheck(
                                "0000PUB-000140"
                            )} /* 国际化处理： 注销*/
                            className="iconfont icon-zhuxiao"
                        />
                        <span>{langCheck("0000PUB-000140")}</span>
                        {/* 国际化处理： 注销*/}
                    </div>
                    <div className="drawer-info">
                        <div className="info">
                            <div className="drawer-logo">
                                <img src={avatar} alt="logo" />
                            </div>
                            <span className="name">{this.props.userName}</span>
                        </div>
                    </div>
                    <div className="drawer-setting">
                        <div className="setting-content">
                            <div
                                onClick={() => {
                                    this.handeleSkipPage("/ds", {
                                        n: langCheck(
                                            "0000PUB-000146"
                                        ) /* 国际化处理： 桌面设置*/
                                    });
                                }}
                                className="setting-btn"
                            >
                                <i className="iconfont icon-gerenpeizhi" />
                                <span
                                    field="setting"
                                    fieldname={langCheck("0000PUB-000146")}
                                >
                                    {/* 国际化处理： 桌面设置*/}
                                    {langCheck("0000PUB-000146")}
                                    {/* 国际化处理： 桌面设置*/}
                                </span>
                            </div>
                            <div
                                onClick={() => {
                                    this.handeleSkipPage("/ui", {
                                        n: langCheck(
                                            "0000PUB-000147"
                                        ) /* 国际化处理： 账户设置*/
                                    });
                                }}
                                className="setting-btn"
                            >
                                <i className="iconfont icon-zhanghushezhi" />
                                <span
                                    field="account"
                                    fieldname={langCheck("0000PUB-000147")}
                                >
                                    {/* 国际化处理： 账户设置*/}
                                    {langCheck("0000PUB-000147")}
                                    {/* 国际化处理： 账户设置*/}
                                </span>
                            </div>
                            <div
                                onClick={() => {
                                    this.handeleSkipPage("/c", {
                                        n: langCheck(
                                            "0000PUB-000148"
                                        ) /* 国际化处理： 个性化设置*/
                                    });
                                }}
                                className="setting-btn"
                            >
                                <i
                                    field="logout"
                                    fieldname={langCheck(
                                        "0000PUB-000140"
                                    )} /* 国际化处理： 注销*/
                                    className="iconfont icon-shezhi1"
                                />
                                <span
                                    field="customize"
                                    fieldname={langCheck("0000PUB-000148")}
                                >
                                    {/* 国际化处理： 个性化设置*/}
                                    {langCheck("0000PUB-000148")}
                                    {/* 国际化处理： 个性化设置*/}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="drawer-link">
                        <ul className="link">
                            <li>
                                <span
                                    field="contact"
                                    fieldname={langCheck(
                                        "0000PUB-000149"
                                    )} /* 国际化处理： 用友服务支持*/
                                    onClick={this.sysinitAccessorAction}
                                >
                                    {langCheck("0000PUB-000149")}
                                    {/* 国际化处理： 用友服务支持*/}
                                </span>
                            </li>
                            {/* <li>
                                <span
                                    field="activation"
                                    fieldname={langCheck(
                                        "0000PUB-000150"
                                    )} 
                                    onClick={this.bindCloudAccount}
                                >
                                    {langCheck("0000PUB-000151")}
                                </span>
                            </li> */}
                            <li>
                                <span
                                    field="log"
                                    fieldname={langCheck(
                                        "0000PUB-000152"
                                    )} /* 国际化处理： 个人日志*/
                                    onClick={() => {
                                        this.handeleSkipPage("/log", {
                                            n: langCheck(
                                                "0000PUB-000152"
                                            ) /* 国际化处理： 个人日志*/
                                        });
                                    }}
                                >
                                    {langCheck("0000PUB-000152")}
                                    {/* 国际化处理： 个人日志*/}
                                </span>
                            </li>
                        </ul>
                    </div>
                </Drawer>
                {this.props.needBind ? <AccountActivation /> : null}
            </div>
        );
    }
}
SideDrawer.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    avatar: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    needBind: PropTypes.bool.isRequired,
    changeDrawer: PropTypes.func.isRequired
};
export default connect(
    state => ({
        isOpen: state.appData.isOpen,
        avatar: state.appData.avatar,
        userName: state.appData.userName,
        needBind: state.appData.needBind
    }),
    {
        changeDrawer
    }
)(withRouter(SideDrawer));

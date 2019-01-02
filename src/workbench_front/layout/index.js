import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { GetQuery, langCheck } from "Pub/js/utils";
import { withRouter } from "react-router-dom";
import { changeDrawer, setAccountInfo, setAvatar } from "Store/appStore/action";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";
import SideDrawer from "./SideDrawer";

// 工作桌面单页通用布局
import TabsLink from "./headerComponents/TabsLink";
import Notice from "Components/Notice";
import Ajax from "Pub/js/ajax";
// import $NCPE from "Pub/js/pe";
import GroupLogo from "Assets/images/Group.png";
import "./index.less";

/**
 * 工作桌面整体布局组件
 */
class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodeName: langCheck("0000PUB-000105") /* 国际化处理： 首页*/
        };
    }
    /**
     * 更新标题名称
     */
    handleUpdateTitleName = () => {
        let { n } = GetQuery(this.props.location.search);
        if (n && n !== "null") {
            let nodeName = n;
            this.setState({ nodeName }, this.updateTitle);
        } else {
            this.setState(
                { nodeName: langCheck("0000PUB-000105") },
                this.updateTitle
            ); /* 国际化处理： 首页*/
        }
    };
    /**
     * 更新title显示名称
     */
    updateTitle = () => {
        document.title = this.state.nodeName;
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
     * 用户信息查询
     */
    reqInfoData = () => {
        let { n = langCheck("0000PUB-000105") } = GetQuery(
            this.props.location.search
        ); /* 国际化处理： 首页*/
        Ajax({
            url: `/nccloud/platform/appregister/querypersonsettings.do`,
            info: {
                name: n,
                appcode: "10228888",
                action: langCheck(
                    "0000PUB-000132"
                ) /* 国际化处理： 业务日期|集团|个人头像|用户名称*/
            },
            success: ({ data: { data } }) => {
                if (data) {
                    this.infoDataManage(data);
                }
            }
        });
    };
    /**
     * 全局信息处理
     */
    infoDataManage = data => {
        let {
            groupVOs,
            bizDateTime,
            userCode,
            userId,
            userName,
            projectCode,
            email,
            nlinkUrl, //pe 调用的请求地址
            needBind, //云账号是否需要绑定
            is_cloud_register
        } = data;
        let selectedKey = "";
        let group_name = "";
        if (groupVOs && groupVOs.length > 0) {
            let { pk_group, groupName } = groupVOs.find(
                item => item.is_selected
            );
            // 集团主键
            selectedKey = pk_group;
            // 集团名称
            group_name = groupName;
        }
        // 切换集团刷新页面
        if (
            this.props.groupId.length > 0 &&
            selectedKey !== this.props.groupId
        ) {
            this.refreshThePage();
        }
        // 设置用户信息
        this.props.setAccountInfo({
            newDate: bizDateTime,
            userName: userName,
            currentData: groupVOs,
            businessDate: bizDateTime,
            userId: userId,
            groupId: selectedKey,
            groupName: group_name,
            userCode: userCode,
            email: email,
            projectCode: projectCode,
            nlinkUrl: nlinkUrl,
            needBind: needBind,
            is_cloud_register: is_cloud_register
        });
        let { c = "10228888", n = langCheck("0000PUB-000105") } = GetQuery(
            /* 国际化处理： 首页*/
            this.props.location.search
        );
        window.peData = {};
        // 应用菜单名
        window.peData.nodeName = n;
        // 应用编码
        window.peData.nodeCode = c;
        // 用户id 由于需要知道具体哪个人所以将userid字段改成userCode 此处需要注意
        window.peData.userID = userCode;
        // 项目编码
        window.peData.projectCode = projectCode;
        // pe 地址
        window.peData.nlinkUrl = nlinkUrl;
        let $NCPE = require("Pub/js/pe");
        // console.log($NCPE);
        // 初始化pe
        window.proxyAction = $NCPE.default.proxyAction;
        window.startAjax = $NCPE.default.startAjax;
        window.endAjax = $NCPE.default.endAjax;
        this.businessInfoSetting();
    };
    /**
     * 为全局添加业务信息
     * 如： 业务日期 业务集团信息 用户id 用户名称 集团id 集团名称 用户编码
     * @param {String} businessDate 业务日期
     * @param {String} userId 用户id
     * @param {String} userName 用户名称
     * @param {String} groupId 集团id
     * @param {String} groupName 集团名称
     * @param {String} userCode 用户编码
     * @param {String} projectCode 项目编码
     */
    businessInfoSetting = () => {
        window.GETBUSINESSINFO = () => {
            let {
                businessDate,
                userId,
                userName,
                groupId,
                groupName,
                userCode,
                projectCode
            } = this.props;
            return {
                businessDate,
                userId,
                userName,
                groupId,
                groupName,
                userCode,
                projectCode
            };
        };
    };
    /**
     * 刷新整个页面
     */
    refreshThePage = () => {
        window.location.reload(true);
    };
    /**
     * 页签激活重新查询用户信息
     */
    handleVisibilityChange = () => {
        if (document.visibilityState !== "hidden") {
            this.reqInfoData();
            console.log(langCheck("0000PUB-000133")); /* 国际化处理： 进入*/
        } else {
            console.log(langCheck("0000PUB-000134")); /* 国际化处理： 离开*/
        }
    };
    /**
     * 心跳请求定时器
     */
    setIntervalHeartbeat = () => {
        this.SessionaLive = window.setInterval(() => {
            this.heartbeat();
        }, 20 * 60 * 1000);
    };
    /**
     * session激活 心跳请求
     */
    heartbeat = () => {
        let { n = langCheck("0000PUB-000105") } = GetQuery(
            this.props.location.search
        ); /* 国际化处理： 首页*/
        Ajax({
            url: `/nccloud/platform/pub/sessionalive.do`,
            info: {
                name: n,
                appcode: "10228888",
                action: langCheck(
                    "0000PUB-000135"
                ) /* 国际化处理： session激活*/
            }
        });
    };
    /**
     * 应用关闭事件
     */
    appClose = () => {
        let { n } = GetQuery(this.props.location.search);
        if (!n) {
            n = langCheck("0000PUB-000105"); /* 国际化处理： 首页*/
        }
        window.proxyAction(
            null,
            null,
            `${n}-${langCheck("0000PUB-000139")}`
        )(); /* 国际化处理： 关闭*/
    };
    /**
     * 合并请求
     */
    mergeRequest = () => {
        let { c, n } = GetQuery(this.props.location.search);
        n = n ? n : langCheck("0000PUB-000105"); /* 国际化处理： 首页*/
        let reqData = [
            {
                rqUrl: "/platform/appregister/querypersonsettings.do",
                rqCode: "querypersonsettings"
            },
            {
                rqUrl: "/platform/userimage/queryuserimage.do",
                rqCode: "queryuserimage"
            }
        ];
        Ajax({
            url: `/nccloud/platform/pub/mergerequest.do`,
            data: reqData,
            info: {
                name: n,
                action: langCheck("0000PUB-000136") /* 国际化处理： 合并请求*/,
                appcode: "10228888"
            },
            loading: true,
            success: ({ data: { data } }) => {
                if (data) {
                    /**
                     * 合并请求 预警信息 全局上下文参数
                     * @param {Object} querypersonsettings 全局上下文信息
                     * @param {String} queryuserimage 用户头像
                     */
                    let { querypersonsettings, queryuserimage } = data;
                    this.infoDataManage(querypersonsettings);
                    if (queryuserimage && queryuserimage.status) {
                        // 设置用户头像
                        this.props.setAvatar(queryuserimage.imageUrl);
                    }
                }
            }
        });
    };

    /**
     * 预警消息查询 其中包含常规预警及到期预警
     */
    alertmsg = () => {
        let { c, n } = GetQuery(this.props.location.search);
        n = n ? n : langCheck("0000PUB-000105"); /* 国际化处理： 首页*/
        Ajax({
            url: `/nccloud/platform/appregister/queryalertmessages.do`,
            data: {
                appcode: c
            },
            info: {
                name: n,
                action: langCheck("0000PUB-000137") /* 国际化处理： 预警消息*/,
                appcode: "10228888"
            },
            success: ({ data: { data } }) => {
                if (data) {
                    let { alertMessageVOList, validDayCount } = data;
                    if (alertMessageVOList.length > 0) {
                        alertMessageVOList.map(item => {
                            Notice({
                                status: "earlyWarning",
                                duration: null,
                                url: item.alertFileUrl,
                                msg: item.alertName
                            });
                        });
                    }
                    if (validDayCount) {
                        validDayCount =
                            validDayCount - 0 > 0 ? validDayCount - 0 : 0;
                        if (validDayCount < 31) {
                            Notice({
                                status: "overdueWarning",
                                day: validDayCount
                            });
                        }
                    }
                }
            }
        });
    };
    componentWillMount() {
        let sprType = localStorage.getItem("spr");
        if (sprType && !JSON.parse(sprType)) {
            // 开启渲染时间和渲染次数记录
            window.sys_monitor.startMonitor();
        }
        this.mergeRequest();
    }
    componentDidMount() {
        this.handleUpdateTitleName();
        this.setIntervalHeartbeat();
        this.alertmsg();
        window.addEventListener("hashchange", this.handleUpdateTitleName);
        window.addEventListener(
            "visibilitychange",
            this.handleVisibilityChange
        );
        window.addEventListener("beforeunload", this.appClose);
    }
    componentWillUnmount() {
        window.removeEventListener("hashchange", this.handleUpdateTitleName);
        window.removeEventListener(
            "visibilitychange",
            this.handleVisibilityChange
        );
        window.removeEventListener("beforeunload", this.appClose);
    }
    render() {
        let { nodeName } = this.state;
        let { isOpen } = this.props;
        
        return (
            <div className="nc-workbench-layout">
                <div
                    className={`nc-workbench-top-container  nccwb-header ${
                        this.props.location.pathname === "/"
                            ? "height-72"
                            : "height-44"
                    }`}
                    onClick={() => {
                        if (isOpen) {
                            this.props.changeDrawer(!isOpen);
                        } else {
                            return;
                        }
                    }}
                    ref="ncWorkbenchTopContainer"
                >
                    <nav
                        field="top-area"
                        fieldname={nodeName}
                        className="nc-workbench-nav"
                    >
                        <div className="nav-left n-left n-v-middle">
                            <HeaderLeft />
                        </div>
                        {this.props.location.pathname === "/" ? (
                            <div
                                className="nav-middle"
                                style={{
                                    background: `url(${GroupLogo}) no-repeat center center`,
                                    backgroundSize: "contain"
                                }}
                            />
                        ) : null}
                        <div className="nav-right n-right n-v-middle">
                            <HeaderRight
                                shouldShowIm={this.props.is_cloud_register}
                            />
                        </div>
                    </nav>
                    {this.props.location.pathname === "/" ? (
                        <div
                            field="top-info"
                            fieldname={langCheck(
                                "0000PUB-000138"
                            )} /* 国际化处理： 顶栏信息*/
                            className="nccwb-header-info"
                        >
                            <TabsLink />
                        </div>
                    ) : null}
                </div>
                <div className="nc-workbench-container">
                    <div className="nc_workbench-container-content">
                        {this.props.children}
                    </div>
                </div>
                <SideDrawer />
            </div>
        );
    }
}
Layout.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    avatar: PropTypes.string.isRequired,
    businessDate: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    userCode: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    groupId: PropTypes.string.isRequired,
    groupName: PropTypes.string.isRequired,
    projectCode: PropTypes.string.isRequired,
    changeDrawer: PropTypes.func.isRequired,
    setAccountInfo: PropTypes.func.isRequired,
    setAvatar: PropTypes.func.isRequired,
    is_cloud_register: PropTypes.bool.isRequired
};
export default withRouter(
    connect(
        state => ({
            isOpen: state.appData.isOpen,
            avatar: state.appData.avatar,
            userId: state.appData.userId,
            userCode: state.appData.userCode,
            userName: state.appData.userName,
            groupId: state.appData.groupId,
            groupName: state.appData.groupName,
            projectCode: state.appData.projectCode,
            businessDate: state.appData.businessDate,
            is_cloud_register: state.appData.is_cloud_register
        }),
        { changeDrawer, setAccountInfo, setAvatar }
    )(Layout)
);

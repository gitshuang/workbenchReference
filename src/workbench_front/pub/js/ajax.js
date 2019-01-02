import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Modal } from "antd";
import Axios from "axios";
import _ from "lodash";
import Notice from "Components/Notice";
import Loading from "Components/Loading";
import { ControlTip } from "Components/ControlTip";
import Gzip from "./gzip";
import platform from "Pub/js/platform";
import { GetQuery, langCheck } from "Pub/js/utils";
Axios.defaults.headers.post["Content-Type"] = "application/json";
let LOGOUT = false;
/**
 * ajax请求方法
 */
const Ajax = params => AjaxPromise(params);
/**
 * 同步处理 是否启用压缩
 */
const AjaxPromise = params => {
    let gzipSwitch = getGlobalStore("gzip");
    if (gzipSwitch !== null) {
        caSecurity(params);
    } else {
        Axios({
            url: `/nccloud/platform/gzip/switch.do`,
            method: "post",
            data: {
                sysParamJson: {
                    busiaction: `${langCheck("0000PUB-000078")}-${langCheck(
                        "0000PUB-000079"
                    )}` /* 国际化处理： 流量压缩,查询*/,
                    ts: Date.parse(new Date())
                }
            },
            async: false
        })
            .then(res => {
                if (res.status === 200) {
                    let {
                        data: {
                            success: successStatus,
                            error: errorStatus,
                            data
                        }
                    } = res;
                    if (successStatus) {
                        setGlobalStore("gzip", data ? 1 : 0);
                        caSecurity(params);
                    } else {
                        Notice({ status: "error", msg: errorStatus.message });
                    }
                }
            })
            .catch(error => {});
    }
};
/**
 * ca 安全 加签       是否是有请求数据的才进行加签
 */
const caSecurity = params => {
    // 获取压缩标识
    let gzipSwitch = getGlobalStore("gzip");
    // 获取加签标识
    // let isNccSign = getGlobalStore("isNccSign");
    // 默认加签
    let isNccSign = true;
    gzipSwitch = JSON.parse(gzipSwitch);
    let reqData = JSON.stringify({
        sysParamJson: {
            busiaction: langCheck(
                "0000PUB-000071"
            ) /* 国际化处理： 查询请求安全加签开关*/
        }
    });
    let gziptools;
    if (gzipSwitch) {
        gziptools = new Gzip();
        reqData = gziptools.zip(reqData);
    }
    if (isNccSign !== null) {
        AjaxMain(params);
    } else {
        // ***************************************************
        // 此处逻辑不执行，要求一定启用加签功能
        Axios({
            url: `/nccloud/platform/security/switch.do`,
            method: "post",
            data: reqData,
            async: false,
            transformResponse: [
                function(data, headers) {
                    // 对 data 进行任意转换处理
                    let gData;
                    // 是否启动压缩
                    if (gzipSwitch) {
                        gData = gziptools.unzip(data);
                    } else {
                        gData = JSON.parse(data);
                    }
                    return gData;
                }
            ]
        })
            .then(res => {
                if (res.status === 200) {
                    let {
                        data: {
                            success: successStatus,
                            error: errorStatus,
                            data
                        }
                    } = res;
                    if (successStatus) {
                        setGlobalStore("isNccSign", data);
                        AjaxMain(params);
                    } else {
                        Notice({ status: "error", msg: errorStatus.message });
                    }
                }
            })
            .catch(error => {});
        // *****************************************************
    }
};
/**
 * Ajax 主要函数
 * @param {String} url 请求地址
 * @param {Object} data 请求数据
 * @param {String} method 请求方法 get/post
 * @param {Boolen} switchKey 是否启用压缩
 * @param {Boolen} loading 是否开启loading
 * @param {Object} info 请求描述对象 name - 发起请求的应用名称  action - 发起请求的动作
 * @param {Function} success 请求成功回调
 */
const AjaxMain = params => {
    let {
        url,
        data,
        method = "post",
        switchKey = false,
        loading = false,
        info = { name: "", action: "" },
        success = res => {
            // console.log(res);
        }
    } = params;
    let userInfos = window.GETBUSINESSINFO ? window.GETBUSINESSINFO() : null;
    let userCode = userInfos && userInfos.userCode ? userInfos.userCode : null;
    let { c } = GetQuery(window.location.hash);
    let appcode = info.appcode ? info.appcode : c ? c : "10228888";
    let div;
    let gzipSwitch = getGlobalStore("gzip");
    gzipSwitch = JSON.parse(gzipSwitch);
    let gziptools = new Gzip();
    data = {
        busiParamJson: JSON.stringify(data),
        sysParamJson: {
            busiaction: `${info.name}-${info.action}`,
            appcode: appcode,
            ts: Date.parse(new Date())
        }
    };
    // 加签
    if (data.busiParamJson) {
        // 加签标识获取  -- bbqin
        // 这里会影响原字符串 （编码、位数？）导致后台解析不了字符串
        let strDataSign = data.busiParamJson + "";
        // 加签 -- bbqin
        userCode && (data.sysParamJson.sn = transSn(userCode));
        userCode &&
            (data.sysParamJson.signdata = transSign(strDataSign, userCode));
    }
    // 判断当前是否为退出操作
    if (url.indexOf("logout") !== -1) {
        LOGOUT = true;
    }
    /**
     * 请求loading
     */
    if (loading) {
        div = document.createElement("div");
        document.body.appendChild(div);
        ReactDOM.render(<Loading />, div);
    }
    /**
     * 开启报错提示
     */
    let flag = true;
    Axios({
        url,
        data,
        method,
        validateStatus: function(status) {
            if (status === 200 && url.indexOf("logout.do") > -1) {
                flag = false;
                exitPage("/nccloud");
            } else {
                // if (status > 500) {
                //     Notice({
                //         status: "error",
                //         msg: "会话结束" /* 国际化处理： 会话结束*/
                //     });
                //     flag = false;
                //     return;
                // }
                return status < 500;
            }
        },
        transformRequest: [
            function(data) {
                // 不压缩
                let gData = JSON.stringify(data);
                // 启动压缩
                if (!switchKey && gzipSwitch) {
                    gData = gziptools.zip(gData);
                }
                return gData;
            }
        ],
        transformResponse: [
            function(data, headers) {
                // 是否存在contentpath 只有401时可能存在
                if (headers.contentpath) {
                    // 是否打开新页签，如果打开将其关闭
                    if (
                        window.newwindow &&
                        window.newwindow.location.origin == "null"
                    ) {
                        window.newwindow.close();
                    }
                    // 用户离线状态，并返回到登录页
                    if (headers.redirect === "REDIRECT") {
                        flag = false;
                        SpecialTip(
                            headers.redirectstatus,
                            exitPage,
                            headers.contentpath
                        );
                        // 鉴权提示
                    } else if (headers.authorize === "FALSE") {
                        Notice({
                            status: "error",
                            msg: langCheck(
                                "0000PUB-000072"
                            ) /* 国际化处理： 该请求未配置鉴权信息*/
                        });
                        return false;
                    } else {
                        exitPage(headers.contentpath);
                    }
                }
                if (headers.environmentmodel) {
                    window.environmentmodel = headers.environmentmodel;
                }
                // 对 data 进行任意转换处理
                let gData;
                // 启动压缩
                if (!switchKey && gzipSwitch) {
                    gData = gziptools.unzip(data);
                } else {
                    gData = JSON.parse(data);
                }
                return gData;
            }
        ]
    })
        .then(res => {
            if (res.status === 200) {
                let {
                    data: { success: successStatus, error: errorStatus }
                } = res;
                if (successStatus) {
                    success(res);
                } else {
                    Notice({ status: "error", msg: errorStatus.message });
                }
                if (loading) {
                    ReactDOM.unmountComponentAtNode(div);
                }
            }
        })
        .catch(error => {
            if (flag) {
                if (error.message === "") {
                    error.message = langCheck(
                        "0000PUB-000073"
                    ); /* 国际化处理： 未知类型错误！*/
                }
                Notice({ status: "error", msg: error.message });
            }
        });
};
/**
 * 强制退出提示
 * @param {Function} callback 回调
 * @param {String} status 状态
 * @param {String} paramData 参数数据
 */
const SpecialTip = (status, callback, paramData) => {
    if (document.querySelector(".ant-modal-mask") === null) {
        ControlTip({
            status: "warning",
            title: langCheck("0000PUB-000074") /* 国际化处理： 退出警告！*/,
            zIndex: 1200,
            msg: switchStatus(status),
            isCancelBtn: false,
            onOk: () => {
                callback(paramData);
            }
        });
    }
    if (LOGOUT) {
        callback(paramData);
    }
};
window.SpecialTip = SpecialTip;
/**
 * 状态选择
 */
const switchStatus = status => {
    switch (status) {
        case "0":
            return langCheck("0000PUB-000075");
        case "1":
            return langCheck("0000PUB-000076");
        case "2":
            return langCheck("0000PUB-000077");
    }
};
/**
 * 设置全局 store
 * @param {String} key
 * @param {Object} value
 */
const setGlobalStore = (key, value) => {
    let infosFromCookie = getCookie(key);
    let infosFromLocalStorage = localStorage.getItem(key);
    if (!infosFromCookie && !infosFromLocalStorage) {
        setCookie(key, value);
        if (!getCookie(key)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    } else if (infosFromCookie) {
        if (value !== getCookie(key)) {
            setCookie(key, value);
        }
    } else if (infosFromLocalStorage) {
        if (JSON.stringify(value) !== localStorage.getItem(key)) {
            setCookie(key, value);
        }
    }
};
/**
 * 获取全局 store
 * @param {String} key
 */
const getGlobalStore = key => {
    let infosFromCookie = getCookie(key);
    let infosFromLocalStorage = localStorage.getItem(key);
    if (infosFromCookie) {
        return JSON.parse(infosFromCookie);
    } else if (infosFromLocalStorage) {
        return JSON.parse(infosFromLocalStorage);
    } else {
        return null;
    }
};
/**
 * 设置 Cookie
 * @param {String} key
 * @param {Object} value
 * @param {String} day
 */
const setCookie = (key, value, day) => {
    value = JSON.stringify(value);
    let expires = "";
    if (day) {
        let d = new Date();
        d.setDate(d.getDate() + day);
        expires = "; expires=" + d.toUTCString();
    }
    document.cookie = key + "=" + value + expires;
};
/**
 * 获取 Cookie
 * @param {String} key
 */
const getCookie = key => {
    let cookies = document.cookie;
    let allCookies = cookies.split("; ").reduce((o, item) => {
        let arr = item.split("=");
        o[arr[0]] = arr[1];
        return o;
    }, {});
    if (key) return allCookies[key];
    return allCookies;
};
/**
 * 退出页面
 */
const exitPage = hrefString => {
    window.location.href = hrefString;
};
export default Ajax;

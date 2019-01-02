import Ajax from "Pub/js/ajax";
import Notice from "Components/Notice";
import {langCheck} from "Pub/js/utils";
import moment from "moment";
export const sprLog = (type, userId, callback) => {
    if (type) {
        // 开启渲染时间和渲染次数记录
        window.sys_monitor.startMonitor();
        Ajax({
            url: "/nccloud/platform/spr/start.do",
            info: {
                name: "spr",
                appcode: "10228888",
                action: langCheck('0000PUB-000128')/* 国际化处理： 开启*/
            },
            data: {
                oprtime: moment().format("YYYY-MM-DD HH:mm:SS"),
                userid: userId
            },
            success: res => {
                let { data } = res.data;
                if (data) {
                    localStorage.setItem("sprTime", data);
                    callback(!type);
                } else {
                    Notice({ status: "error", msg: res.error.message });
                }
            }
        });
        // callback(!type);
    } else {
        let win = window.open("", "_blank");
        let { renderTimes, renderCost } = MonitorData();
        let resTime = localStorage.getItem("sprTime");
        // callback(!type);
        Ajax({
            url: "/nccloud/platform/spr/end.do",
            info: {
                name: "spr",
                appcode: "10228888",
                action: langCheck('0000PUB-000129')/* 国际化处理： 结束*/
            },
            data: {
                renderTimes,
                renderCost,
                oprtime: resTime,
                userid: userId
            },
            success: res => {
                let { data } = res.data;
                if (data) {
                    if (win) {
                        callback(!type);
                        localStorage.setItem("sprTime", !type);
                        if (win && win.location.href == "about:blank") {
                            win.location.href = data;
                            win.focus();
                        }
                    }
                } else {
                    if (win) {
                        win.close();
                    }
                    Notice({ status: "error", msg: res.error.message });
                }
            }
        });
    }
};
/**
 * 监控数据整理
 */
const MonitorData = () => {
    let monitorData = window.sys_monitor.endMonitor();
    if (monitorData.WARINING) {
        return {
            renderCost: 0,
            renderTimes: 0
        };
    } else {
        monitorData = JSON.parse(monitorData);
        let renderCost = 0;
        if (monitorData.countNumber.length > 0) {
            monitorData.countNumber.map(item => {
                let itemNum = item.split("：")[1].split(langCheck('0000PUB-000130'))[0];/* 国际化处理： 秒*/
                renderCost += itemNum - 0;
            });
        }
        return {
            renderTimes: monitorData.count,
            renderCost
        };
    }
};

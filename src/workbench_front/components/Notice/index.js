import React from "react";
import { notification } from "antd";
import Svg from "Components/Svg";
import { langCheck } from 'Pub/js/utils';
import "./index.less";
/**
 * @param {String} status 状态标识
 * @param {String} msg 提示信息
 * @param {Number} duration 显示时间 单位秒
 * @param {String} url 跳转url （ 预警需要 ）
 * @param {Number} day 授权剩余天数 （ 过期预警需要 ）
 */
const Notice = ({ status, msg = langCheck('0000PUB-000020'), duration = 6, url, day }) => {/* 国际化处理： 操作成功*/
    // let { langCheck } = window;
    let Obj = {};
    notification.config({
        placement: "topRight",
        top: 105
    });
    switch (status) {
        // 成功
        case "success":
            Obj = {
                icon: (
                    <Svg width={25} height={25} xlinkHref={"#icon-wancheng"} />
                ),
                className: "nc-notification success",
                message: langCheck('0000PUB-000021'),/* 国际化处理： 已成功！*/
                description: msg,
                duration: 3,
                style: {
                    color: "#67C23A"
                }
            };
            break;
        // 警告
        case "warning":
            Obj = {
                icon: <Svg width={25} height={25} xlinkHref={"#icon-zhuyi1"} />,
                className: "nc-notification warning",
                message: langCheck('0000PUB-000022'),/* 国际化处理： 请注意！*/
                description: msg,
                duration: duration,
                style: {
                    color: "#FF8B00"
                }
            };
            break;
        // 报错
        case "error":
            Obj = {
                icon: <Svg width={25} height={25} xlinkHref={"#icon-shibai"} />,
                className: "nc-notification error",
                message: langCheck('0000PUB-000023'),/* 国际化处理： 出错啦！*/
                description: msg,
                duration: null,
                style: {
                    color: "#F56C6C"
                }
            };
            break;
        // 类型错误
        case "typeError":
            Obj = {
                icon: <Svg width={25} height={25} xlinkHref={"#icon-shibai"} />,
                className: "nc-notification error",
                message: langCheck('0000PUB-000024'),/* 国际化处理： 操作失败！*/
                description: msg,
                duration: duration,
                style: {
                    color: "#F56C6C"
                }
            };
            break;
        // 预警
        case "earlyWarning":
            const key = `open${Date.now()}`;
            Obj = {
                icon: <Svg width={25} height={25} xlinkHref={"#icon-zhuyi1"} />,
                key,
                className: "nc-notification earlyWarning",
                message: (
                    <div className="earlyWarning-header">
                        <span>{langCheck('0000PUB-000025')}</span>{/* 国际化处理： 预警!*/}
                        <div>
                            <a href={url} target="_blank" onClick={() => notification.close(key)}>
                                {langCheck('0000PUB-000026')}
                                {/* 国际化处理： 立即查看*/}
                            </a>
                            <a onClick={() => notification.close(key)}>{langCheck('0000PUB-000027')}</a>{/* 国际化处理： 关闭*/}
                        </div>
                    </div>
                ),
                description: msg,
                duration: duration,
                style: {
                    color: "#555555"
                }
            };
            break;
        // 过期警告
        case "overdueWarning":
            Obj = {
                icon: <Svg width={25} height={25} xlinkHref={"#icon-zhuyi1"} />,
                className: "nc-notification overdueWarning",
                message: `${langCheck('0000PUB-000028')}${day}${langCheck('0000PUB-000029')}`,/* 国际化处理： 您的授权将在,天后到期，请注意及时续费*/
                description: null,
                duration: null,
                style: {
                    color: "#555555"
                }
            };
            break;
        case "simpleSuccess":
            Obj = {
                icon: (
                    <Svg width={25} height={25} xlinkHref={"#icon-wancheng"} />
                ),
                className: "nc-notification simpleSuccess",
                message: msg,
                description: null,
                duration: 3,
                style: {
                    color: "#555555"
                }
            };
            break;
        default:
            break;
    }
    notification.open({ ...Obj });
};

export default Notice;

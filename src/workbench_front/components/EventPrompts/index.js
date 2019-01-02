import { ControlTip } from "Components/ControlTip";
import { langCheck } from 'Pub/js/utils';
/**
 * 基础提示方法
 * @param {Function} okCallback 确定回调
 * @param {String} title 提示标题
 * @param {String} content 提示内容
 * @param {Function} cancelCallback 取消回调
 */
const PromptsFun = (status, okCallback, title, content, cancelCallback) => {
    ControlTip({
        status: status,
        title: title,
        msg: content,
        onOk: okCallback,
        onCancel: cancelCallback
    });
};
/**
 * 取消提示
 * @param {Function} okCallback 确定回调
 * @param {Function} cancelCallback 取消回调
 * @param {String} title 提示标题
 * @param {String} content 提示内容
 */
const CancelPrompts = (
    okCallback,
    title = langCheck('0000PUB-000000'),/* 国际化处理： 取消*/
    content = langCheck('0000PUB-000004'),/* 国际化处理： 确定要取消吗?*/
    cancelCallback = () => {}
) => {
    PromptsFun("warning", okCallback, title, content, cancelCallback);
};
/**
 * 删除提示
 * @param {Function} okCallback 确定回调
 * @param {Function} cancelCallback 取消回调
 * @param {String} title 提示标题
 * @param {String} content 提示内容
 */
const DelPrompts = (
    okCallback,
    title = langCheck('0000PUB-000005'),/* 国际化处理： 删除*/
    content = langCheck('0000PUB-000006'),/* 国际化处理： 确定要删除吗?*/
    cancelCallback = () => {}
) => {
    PromptsFun("warning", okCallback, title, content, cancelCallback);
};
/**
 * 保存提示
 * @param {Function} okCallback 确定回调
 * @param {Function} cancelCallback 取消回调
 * @param {String} title 提示标题
 * @param {String} content 提示内容
 */
const SavePrompts = (
    okCallback,
    title = langCheck('0000PUB-000007'),/* 国际化处理： 保存*/
    content = langCheck('0000PUB-000008'),/* 国际化处理： 确定要保存吗?*/
    cancelCallback = () => {}
) => {
    PromptsFun("warning", okCallback, title, content, cancelCallback);
};
export { CancelPrompts, DelPrompts, SavePrompts };

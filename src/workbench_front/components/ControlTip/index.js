import React from 'react';
import ReactDOM from 'react-dom';
import ControlBox from './ControlBox';

export const ControlTip = ({ status, title, msg, onOk, onCancel, isOkBtn=true, isCancelBtn=true }) => {
    let toastIcon = (status) => {
        let iconName = '';
        if (status === 'success') {
            iconName = 'icon-wancheng';
        } else if (status === 'info') {
            iconName = 'icon-tixing';
        } else if (status === 'warning') {
            iconName = 'icon-zhuyi1';
        } else if (status === 'danger') {
            iconName = 'icon-shibai';
        }
        const name = `icon iconfont ${iconName} ${status}`;
        return (
            <p className='prompt-title'>
                <i className={name} />
                <span>{title}</span>
            </p>
        );
    };
    let div = document.createElement('div');
    div.className='prompt-project';
    document.getElementById('app').appendChild(div);
    const promptBox = ReactDOM.render(
        <ControlBox toastIcon={toastIcon(status)} msg={msg} cancelClick={onCancel} okClick={onOk} isOkBtn={isOkBtn} isCancelBtn={isCancelBtn}/>,
        div
    );
    return promptBox;
};

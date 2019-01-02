import React, { Component } from 'react';
import { langCheck } from 'Pub/js/utils';
import './slider.less';
export default class SliderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: false,
            title: langCheck('OwnLog-000011', 'pages', props.langJson), // 国际化处理：业务日志详细信息
            showHeader: true,
            showFooter: false,
            bodyInnerHTML: langCheck('OwnLog-000012', 'pages', props.langJson) //国际化处理：主体内容
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            flag: nextProps.flag
        });
    }

    toogleSideBox = () => {
        this.setState({ flag: !this.state.flag }, () => this.props.onChange(this.state.flag));
    };

    render() {
        let { headerInnerHTML, footerInnerHTML, record } = this.props;
        let { flag, showHeader, showFooter, title } = this.state;
        let htmlArray = [];
        if (flag && record && record.logmsg && record.logmsg.value) {
            htmlArray = record.logmsg.value.split('^^');
        }

        return (
            <div className={`${flag ? 'side-box side-box-show' : 'side-box side-box-hide'}`}>
                <div className={`${flag ? 'side-box-content content-show' : 'side-box-content content-hide'}`}>
                    {showHeader && (
                        <header className='header'>
                            <span className='title'>{title}</span>
                            {headerInnerHTML}
                            <a href='javaScript:void(0)' onClick={this.toogleSideBox}>
                                {langCheck('OwnLog-000012', 'pages', this.props.langJson)}{/*国际化处理：收起 →*/}
                            </a>
                        </header>
                    )}
                    <div className='body'>
                        {flag &&
                        htmlArray.length > 0 && (
                            <div>
                                {htmlArray.map((item, index) => (
                                    <p key={index} style={{ marginBottom: '10px' }}>
                                        {item}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                    {showFooter && <footer className='footer'>{footerInnerHTML}</footer>}
                </div>
            </div>
        );
    }
}
// SliderModal.defaultProps = {
// 	title:langCheck("OwnLog-000011"),// '业务日志详细信息',
// 	showHeader: true,
// 	showFooter: false,
// 	bodyInnerHTML: langCheck("OwnLog-000011")//'主体内容'
// };

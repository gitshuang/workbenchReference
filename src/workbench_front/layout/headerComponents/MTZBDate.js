import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { Tooltip } from "antd";
import { setAccountInfo } from "Store/appStore/action";
import platform from "Pub/js/platform";
import Ajax from "Pub/js/ajax";
import {langCheck} from "Pub/js/utils";
import "./MTZBDate.less";
let { base, LocalToDongbaTime } = platform;
const NCTZDatePickClientHourTime = base.NCTZDatePickClientHourTime;
const FORMAT = "YYYY-MM-DD HH:mm:ss";
const dateInputPlaceholder = langCheck('0000PUB-000114');/* 国际化处理： 选择日期*/
const Today = LocalToDongbaTime(moment()).format(FORMAT);

class MTZBDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            value: Today
        };
    }
    onChange = date => {
        if(date){
            this.setState({
                value: date,
                isOpen: true
            });
        }
    };
    /**
     * 取消日期
     */
    handleCancel = () => {
        this.setState({
            isOpen: false,
            value: this.props.businessDate
        });
    };
    /**
     * 确定事件
     */
    handleOk = () => {
        this.handleDateChange();
    };
    /**
     * 今天事件
     */
    handleToday = () => {
        this.setState({ value: Today }, this.handleDateChange);
    };
    /**
     * 业务日期打开
     */
    handleBusinessOpen = () => {
        this.setState({
            isOpen: true
        });
    };
    /**
     * 业务日期关闭
     */
    handleBusinessClose = () => {
        if(this.props.businessDate){
            this.setState({
                value: this.props.businessDate,
                isOpen: false
            });
        }
    };
    /**
     * 业务日期切换
     */
    handleDateChange = () => {
        let newDate = this.state.value;
        Ajax({
            url: `/nccloud/platform/appregister/setbizdate.do`,
            info: {
                name: langCheck('0000PUB-000115'),/* 国际化处理： 业务日期*/
                appcode: "10228888",
                action: langCheck('0000PUB-000116')/* 国际化处理： 更改业务日期*/
            },
            data: {
                bizDateTime: newDate
            },
            success: ({ data: { data } }) => {
                if (data) {
                    this.setState({
                        isOpen: false
                    });
                    this.props.setAccountInfo({
                        businessDate: newDate
                    });
                }
            }
        });
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.businessDate !== this.state.value) {
            this.setState({ value: nextProps.businessDate });
        }
    }
    render() {
        let { isOpen, value } = this.state;
        let flag = value.substr(0, 10) == Today.substr(0, 10);
        let busunessTitle = flag ? langCheck('0000PUB-000115') : langCheck('0000PUB-000117');/* 国际化处理： 业务日期,该业务日期不是今日日期!*/
        const ExtraFooter = (
            <div className="workbench-ExtraFooter">
                <div className="left">
                    <span className="btn" onClick={this.handleToday}>
                        {langCheck('0000PUB-000118')}{/* 国际化处理： 今天*/}
                    </span>
                </div>
                <div className="right">
                    <span className="btn" onClick={this.handleOk}>
                        {langCheck('0000PUB-000108')}{/* 国际化处理： 确定*/}
                    </span>
                    <span
                        className="btn margin-left-15"
                        onClick={this.handleCancel}
                    >
                        {langCheck('0000PUB-000119')}{/* 国际化处理： 取消*/}
                    </span>
                </div>
            </div>
        );
        return (
            <div
                field="business-date"
                fieldname={langCheck('0000PUB-000115')}/* 国际化处理： 业务日期*/
                className={`nc-workbench-businessdate ${
                    flag ? "" : "unbusinessdate"
                }`}
            >
                <NCTZDatePickClientHourTime
                    className={
                        "field_business-date nc-workbench-businessdate-dropdown"
                    }
                    format={FORMAT}
                    datepickerOpen={isOpen}
                    onChange={this.onChange}
                    value={moment(value)}
                    placeholder={dateInputPlaceholder}
                    showToday={false}
                    showOk={false}
                    showTime={false}
                    renderFooter={() => ExtraFooter}
                    autofocus={false}
                    showClear={false}
                    renderIcon={() => (
                        <i
                            className={`iconfont ${
                                // flag ? "icon-rili-jin" : "icon-rili"
                                "icon-rili"
                            }`}
                        />
                    )}
                />
                {!flag ? <span className="business-date-flag">!</span> : ""}
                <Tooltip placement="bottom" title={busunessTitle}>
                    <div
                        className="business-date-block"
                        onClick={this.handleBusinessOpen}
                    />
                </Tooltip>
                {isOpen ? (
                    <div
                        className="business-date-mask"
                        onClick={this.handleBusinessClose}
                    />
                ) : null}
            </div>
        );
    }
}
MTZBDate.propsTypes = {
    businessDate: PropTypes.string.isRequired
};

export default connect(
    ({ appData }) => ({
        businessDate: appData.businessDate
    }),
    { setAccountInfo }
)(MTZBDate);

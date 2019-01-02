import React, { Component } from "react";
import { Input, Select, Checkbox, Button } from "antd";
import _ from "lodash";
import { langCheck } from "Pub/js/utils";
import { getMulti } from 'Pub/js/getMulti';
const Option = Select.Option;
//批量设置的组件单元类
//输入框组件类
export class EditableCell extends React.Component {
    constructor(props) {
        super(props);
    }
    //数据变化
    handleChange = e => {
        const value = e.target.value;
        this.props.updateValue(value);
    };
    //控制渲染
    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {},
            thisState = this.state || {};
        if (this.props.value !== nextProps.value) {
            return true;
        }
        return false;
    }
    render() {
        const { value } = this.props;
        return (
            <Input
                size="small"
                style={{ width: 100 }}
                value={value}
                onChange={this.handleChange}
                ref={input => (this[`input`] = input)}
            />
        );
    }
}
//编辑一纵列单元格组件类
export class EditAllCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: "",
            json: {}
        };
    }
    //点击确定
    handleClick = e => {
        this.props.onChange(this.state.inputValue);
        this.props.hidePopover();
    };
    //隐藏popOver输入框
    close = () => {
        this.props.hidePopover();
    };
    //数据变化
    changeValue = e => {
        this.setState({ inputValue: e.target.value });
    };
    componentDidMount() {
        //多语
        let callback = (json) => {
			// console.log('json', json);
            this.setState({
                json:json
            });
        };
        getMulti({
            moduleId: 'ZoneSetting',
            // currentLocale: 'zh-CN',
            domainName: 'workbench',
            callback
        });
    }
    render() {
        let { json } = this.state;
        return (
            <div className="custom-filter-dropdown">
                <Input
                    value={this.state.inputValue}
                    size="small"
                    ref={`customInput`}
                    onChange={this.changeValue}
                />
                <Button type="primary" onClick={this.handleClick}>
                    {langCheck('ZoneSetting-000005', 'pages', json)}
                    {/* /* 国际化处理： 确定*/ }
                </Button>
                <Button onClick={this.close}>{langCheck('ZoneSetting-000006', 'pages', json)}</Button>
                {/* /* 国际化处理： 取消*/ }
            </div>
        );
    }
}
//复选框组件类
export class EditableCheck extends React.Component {
    constructor(props) {
        super(props);
    }
    //checked选择值变化
    handleChange = e => {
        this.props.onChange(e.target.checked);
    };
    //控制渲染
    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {},
            thisState = this.state || {};
        if (this.props.value !== nextProps.value) {
            return true;
        }
        return false;
    }
    render() {
        const { value } = this.props;
        return (
            <Checkbox checked={Boolean(value)} onChange={this.handleChange} />
        );
    }
}
//选择框组件类
export class SelectCell extends Component {
    constructor(props) {
        super(props);
    }
    //下拉选择变化
    handleSelectChange = value => {
        this.props.onChange(value);
    };
    //控制渲染
    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {},
            thisState = this.state || {};
        if (this.props.selectValue !== nextProps.selectValue) {
            return true;
        }
        return false;
    }
    render() {
        const { selectValue, selectObj, property } = this.props;
        return (
            <Select
                value={
                    _.isEmpty(selectValue) ? selectObj[0].value : selectValue
                }
                onChange={value => {
                    this.handleSelectChange(value);
                }}
                style={{ width: 100 }}
                size={"small"}
            >
                {(() => {
                    if (property === "color") {
                        return selectObj.map((c, index) => {
                            return (
                                <Option key={index} value={c.value}>
                                    <span className="template-setting-color-select">
                                        <span>{c.name}</span>
                                        <span
                                            className="color-select-color"
                                            style={{ backgroundColor: c.value }}
                                        />
                                    </span>
                                </Option>
                            );
                        });
                    } else {
                        return selectObj.map((c, index) => {
                            return (
                                <Option key={index} value={c.value}>
                                    {c.name}
                                </Option>
                            );
                        });
                    }
                })()}
            </Select>
        );
    }
}

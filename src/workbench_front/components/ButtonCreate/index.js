import React, { Component } from "react";
import { Button } from "antd";
import './index.less';
const ButtonGroup = Button.Group;
/**
 * datasource - 按钮描述 数据源
 * {
        code:'addAppClass', - 按钮编码
        name: "增加应用分类", - 按钮名称
        type: "primary", - 按钮类型
        group: true, - 需要按钮组组内按钮
        isshow:true - 是否显示
    },
 * onClick - 按钮 Click 事件
 */
class CreateButton extends Component {
    constructor(props) {
        super(props);
    }
    createBtn = btns => {
        return btns.map(item => {
            if (item.isshow) {
                return (
                    <Button
                        className={`margin-left-6 ${
                            item.className ? item.className : ""
                        }`}
                        key={item.code}
                        type={item.type}
                        onClick={() => {
                            this.props.onClick(item.code);
                        }}
                    >
                        {item.name}
                    </Button>
                );
            } else {
                return null;
            }
        });
    };
    createBtnGroup = btnGroup => {
        if (btnGroup.length > 0) {
            return <ButtonGroup>{this.createBtn(btnGroup)}</ButtonGroup>;
        } else {
            return null;
        }
    };
    createButton = dataSource => {
        // 按钮组
        let btnGroup = dataSource.filter(item => item.group);
        // 独立按钮
        let btns = dataSource.filter(item => !item.group);
        return (
            <div>
                {this.createBtn(btns)}
                {this.createBtnGroup(btnGroup)}
            </div>
        );
    };
    render() {
        return (
            <div
                className={`buttons-component ${
                    this.props.className ? this.props.className : ""
                }`}
            >
                {this.createButton(this.props.dataSource)}
            </div>
        );
    }
}
export default CreateButton;

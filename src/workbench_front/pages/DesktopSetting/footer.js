import React, { Component } from "react";
import _ from "lodash";
import { Button, Modal, Radio, Popconfirm, Tooltip } from "antd";
import Ajax from "Pub/js/ajax";
//自定义组件
import { compactLayoutHorizontal } from "./compact.js";
import { connect } from "react-redux";
import { updateGroupList } from "Store/test/action";
import * as utilService from "./utilService";
import Notice from "Components/Notice";
import { withRouter } from "react-router-dom";
import {ControlTip} from 'Components/ControlTip';//黎明弹出框
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
//footer
class MyFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            selectedValue: 0
        };
    }
    //删除若干目标卡片的方法
    deleteTargetCards = (property, value) => {
        let { groups } = this.props;
        groups = _.cloneDeep(groups);
        utilService.removeTargetCardsInGroup(groups, property, value);
        _.forEach(groups, g => {
            let compactedLayout = compactLayoutHorizontal(
                g.apps,
                this.props.col
            );

            g.apps = compactedLayout;
        });
        
        this.props.updateGroupList(groups);
    };
    getGroupItemNameRadio = groups => {
        if (!groups) return;
        return (
            <RadioGroup
                className="modal-radio-group"
                value={this.state.selectedValue}
                onChange={this.onChangeRadio.bind(this)}
            >
                {groups.map((g, i) => {
                    return (
                        [<Radio
                            className="modal-radio"
                            key={g.pk_app_group}
                            value={g.pk_app_group}
                        >
                            {g.groupname}
                        </Radio>,<br/>]
                    );
                })}
            </RadioGroup>
        );
    };
    //移动到的弹出框中，组名选择
    onChangeRadio = e => {
        this.setState({ selectedValue: e.target.value });
    };
    showModalVisible = () => {
        this.setModalVisible(true);
    };
    showModalHidden = () => {
        this.setModalVisible(false);
    };
    setModalVisible = modalVisible => {
        this.setState({ modalVisible, selectedValue: 0 });
    };
    //移动到的弹出框中，点击确认
    onOkMoveDialog = () => {
        const modalVisible = false;
        const targetGroupID = this.state.selectedValue;
        if (targetGroupID === 0) {
            return;
        }
        let { groups } = this.props;
        groups = _.cloneDeep(groups);
        //需要重新布局的组，需要把目标组也加进来
        let sourceGroupIDArr = [];
        //删掉所有被勾选的卡片，合并到目标组中，并且目标组内去重
        let moveCardArr = [];
        let targetGroupIndex = -1;

        _.forEach(groups, (g, i) => {
            let flag = false;
            if (g.pk_app_group === targetGroupID) {
                targetGroupIndex = i;
                sourceGroupIDArr.push(g.pk_app_group);
                return;
            }
            const tmpArr = _.remove(g.apps, a => {
                if (a.isChecked) {
                    flag = true;
                }
                return a.isChecked;
            });
            if (flag && sourceGroupIDArr.indexOf(g.pk_app_group) === -1) {
                sourceGroupIDArr.push(g.pk_app_group);
            }
            moveCardArr = _.concat(moveCardArr, tmpArr);
        });

        utilService.setPropertyValueForCardsInCards(
            moveCardArr,
            "isChecked",
            false
        );
        utilService.setPropertyValueForCardsInCards(
            groups[targetGroupIndex].apps,
            "isChecked",
            false
        );
        //set moveCard grix gridy Max防止放置的元素对目标原卡片组位置影响
        utilService.setGridXGridYMaxInCards(moveCardArr);

        groups[targetGroupIndex].apps = _.concat(
            groups[targetGroupIndex].apps,
            moveCardArr
        );
        groups[targetGroupIndex].apps = _.uniqBy(
            groups[targetGroupIndex].apps,
            "cardid"
        );
        //循环所有改变的组，进行重新布局
        _.forEach(groups, g => {
            if (sourceGroupIDArr.indexOf(g.pk_app_group) === -1) {
                return;
            }
            if (g.apps.length === 0) {
                return;
            }
            let compactedLayout = compactLayoutHorizontal(
                g.apps,
                this.props.col
            );

            // const firstCard = compactedLayout[0];

            // compactedLayout = compactLayout(compactedLayout, firstCard);

            g.apps = compactedLayout;
        });
        this.props.updateGroupList(groups);
        this.setModalVisible(modalVisible);
    };
    cancleSave = () => {
        if (this.props.relateidObj.type === "userID") {
            this.props.history.push(`/`);
        } else {
            self.opener = null;
            self.close();
        }
    };
    hasCheckedCardInGroups = () => {};
    //抽象方法，参数为显示的button文本和方法体，注意方法提前bind
    getMoveCardButton = (text, fn) => {
        let tmpDom;
        const { groups } = this.props;
        const isDisabled = utilService.hasCheckedCardInGroups(groups);
        tmpDom = (
            <Button
                className="footer-button"
                disabled={!isDisabled}
                onClick={fn}
            >
                {text}
            </Button>
        );
        return tmpDom;
    };
    //清除失效btn
    getExpiredCardButton = (text, fn) => {
        let expiredDom;
        const { groups } = this.props;
        const isDisabled = utilService.hasExpiredCardInGroups(groups);
        expiredDom = (
            <Tooltip 
                title={this.props.json['DesktopSetting-000003']}/* 国际化处理： 点击按钮, 清除所有无权限的应用*/
            >
                <Button
                    disabled={!isDisabled}
                    onClick={fn}
                    // type="primary"
                    className='footer-button'
                >
                    {text}
                </Button>
            </Tooltip>
        );
        return expiredDom;
    };
    //保存
    saveGroupItemAndCard = () => {
        let tmpData = [];
        _.forEach(this.props.groups, (g, i) => {
            let tmp = {
                groupname: g.groupname,
                apps: [],
                position: i
            };
            if (g.pk_app_group.indexOf("newGroupItem") === -1) {
                tmp.pk_app_group = g.pk_app_group;
            }
            _.forEach(g.apps, a => {
                if (a.cardid.indexOf("_") !== -1) {
                    const tmpIDArr = a.cardid.split("_");
                    a.cardid = tmpIDArr[0];
                }
                tmp.apps.push({
                    cardid: a.cardid,
                    gridx: a.gridx,
                    gridy: a.gridy
                });
            });
            tmpData.push(tmp);
        });

        let saveData = {
            isuser: this.props.relateidObj.code, //0职责 1用户 2集团
            data: tmpData
        };
        if (this.props.relateidObj.code === "0") {
            saveData.relateid = this.props.relateidObj.data;
        }
        window.onbeforeunload = null;//保存之前清除window方法
        Ajax({
            url: `/nccloud/platform/appregister/setapp.do`,
            info: {
                name: this.props.json['DesktopSetting-000004'],/* 国际化处理： 工作桌面配置*/
                action: this.props.json['DesktopSetting-000005']/* 国际化处理： 保存*/
            },
            data: saveData,
            success: res => {
                const { data, success } = res.data;
                if (success) {
                    setTimeout(() => {
                        if (this.props.relateidObj.type === "userID") {
                            this.props.history.push(`/`);
                        } else {
                            self.opener = null;
                            self.close();
                        }
                    }, 1000);

                    Notice({ status: "success", msg: data });
                } else {
                    Notice({ status: "error", msg: data });
                }
            }
        });
    };
    toBeDefault = () => {
        window.onbeforeunload = null;
        Ajax({
            url: `/nccloud/platform/appregister/resetworkbench.do`,
            info: {
                name: this.props.json['DesktopSetting-000004'],/* 国际化处理： 工作桌面配置*/
                action: this.props.json['DesktopSetting-000006']/* 国际化处理： 恢复默认*/
            },
            data: {
                relateid: this.props.relateidObj.data
            },
            success: res => {
                const { data, success } = res.data;
                if (success) {
                    Notice({ status: "success", msg: this.props.json['DesktopSetting-000007'] });/* 国际化处理： 恢复默认成功*/
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                } else {
                    Notice({ status: "error", msg: data });
                }
            }
        });
    };
    //恢复默认设置
    showDefaultConfirm = () => {
        // confirm({
        //     title: '确定恢复至出厂设置桌面吗？',
        //     okText: '确定',
        //     okType: 'danger',
        //     cancelText: '取消',
        //     mask: false,
        //     onOk:() => {
        //         this.toBeDefault()
        //     },
        //     onCancel() {}
        // })
        ControlTip({
            status: 'warning',
            title:this.props.json['DesktopSetting-000006'],/* 国际化处理： 恢复默认*/
            msg: this.props.json['DesktopSetting-000008'],/* 国际化处理： 确定恢复至出厂设置桌面吗？*/
            onOk: () => {
                this.toBeDefault()
            }
        });
    };
    //取消弹窗
    showCancelConfirm = () => {
        // confirm({
        //     title: '确定要取消吗？',
        //     okText: '确定',
        //     okType: 'danger',
        //     cancelText: '取消',
        //     mask: false,
        //     onOk:() => {
        //         this.cancleSave()
        //     },
        //     onCancel() {}
        // })
        //黎明封装弹窗
        ControlTip({
            status: 'warning',
            title:this.props.json['DesktopSetting-000009'],/* 国际化处理： 取消*/
            msg: this.props.json['DesktopSetting-000010'],/* 国际化处理： 确定要取消吗？*/
            onOk: () => {
                this.cancleSave();
            }
        });
    }
    render() {
        const { groups, initialGroups } = this.props;
        // console.log(json);
        const groupNameRadioGroup = this.getGroupItemNameRadio(groups);
        //用户工作桌面配置才显示‘恢复默认’按钮
        const isShowToBeDefault = 
            this.props.relateidObj.type === "userID" ? "block" : "none";
        const changeState = _.isEqual(this.props.groups, this.props.initialGroups) ? true : false;
        return (
            <div className="nc-workbench-home-footer">
                <div className="footer-left">
                    {this.getExpiredCardButton(this.props.json['DesktopSetting-000011'], () => {/* 国际化处理： 清除失效*/
                        this.deleteTargetCards("haspower", false);
                    })}
                    {this.getMoveCardButton(this.props.json['DesktopSetting-000012'], () => {/* 国际化处理： 删除*/
                        this.deleteTargetCards("isChecked", true);
                    })}
                    {this.getMoveCardButton(this.props.json['DesktopSetting-000013'], this.showModalVisible)}
                    {/* /* 国际化处理： 移动*/ }
                </div>
                <div className="footer-right">
                    <Button
                        className="right-button"
                        type="primary"
                        onClick={this.saveGroupItemAndCard}
                    >
                        {this.props.json['DesktopSetting-000005']}
                        {/* /* 国际化处理： 保存*/ }
                    </Button>
                    <Button
                        style={{ display: isShowToBeDefault }}
                        className="right-button footer-button"
                        onClick={this.showDefaultConfirm}
                    >
                        {this.props.json['DesktopSetting-000006']}
                        {/* /* 国际化处理： 恢复默认*/ }
                    </Button>

                    { changeState
                        ?
                        <Button className="right-button footer-button" onClick={this.cancleSave}>
                            {this.props.json['DesktopSetting-000009']}
                            {/* /* 国际化处理： 取消*/ }
                        </Button>
                        :
                        <Button className="right-button footer-button" onClick={this.showCancelConfirm}>
                            {this.props.json['DesktopSetting-000009']}
                            {/* /* 国际化处理： 取消*/ }
                        </Button>
                    }
                </div>
                <Modal
                    closable={false}
                    title={this.props.json['DesktopSetting-000014']}/* 国际化处理： 移动到*/
                    mask={false}
                    wrapClassName="desk-setting-vertical-center-modal"
                    visible={this.state.modalVisible}
                    onOk={this.onOkMoveDialog}
                    onCancel={this.showModalHidden}
                    footer={[
                        <Button
                            key="submit"
                            disabled={this.state.selectedValue === 0}
                            type="primary"
                            onClick={this.onOkMoveDialog}
                        >
                            {this.props.json['DesktopSetting-000015']}
                            {/*  国际化处理： 确定*/ }
                        </Button>,
                        <Button key="back" onClick={this.showModalHidden}>
                            {this.props.json['DesktopSetting-000009']}
                            {/* /* 国际化处理： 取消*/ }
                        </Button>
                    ]}
                >
                    {groupNameRadioGroup}
                </Modal>
            </div>
        );
    }
}
export default connect(
    state => ({
        groups: state.templateDragData.groups,
        col: state.templateDragData.layout.col,
        initialGroups: state.templateDragData.initialGroups,
        json: state.templateDragData.json
    }),
    {
        updateGroupList
        //存储数据
    }
)(withRouter(MyFooter));

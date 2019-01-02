import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setAccountInfo } from "Store/appStore/action";
import { Select, Modal } from "antd";
import Ajax from "Pub/js/ajax";
import {langCheck} from "Pub/js/utils";
import GroupSwitch from "./GroupSwitch";

const Option = Select.Option;
const warningConfirm = Modal.warning;
class GroupSelection extends React.Component {
    constructor(props) {
        super(props);
    }
    /**
     * 刷新整个页面
     */
    refreshThePage = () => {
        window.location.reload(true);
    };
    /**
     * 清空模板缓存数据
     */
    ckearTempletStorage = () => {
        for (let iterator of Object.keys(window.localStorage)) {
            if (iterator.indexOf("appTempletStorage_") > -1) {
                window.localStorage.removeItem(iterator);
            }
        }
    };
    /**
     * 组织切换
     * @param {String} value 选中组织的value值
     */
    handleChange = value => {
        warningConfirm({
            closable: false,
            title: langCheck('0000PUB-000106'),/* 国际化处理： 请注意！*/
            content: langCheck('0000PUB-000107'),/* 国际化处理： 切换集团将会重新加载数据。*/
            okText: langCheck('0000PUB-000108'),/* 国际化处理： 确定*/
            okType: "danger",
            mask: false,
            onOk: () => {
                let selectedGroup = this.props.currentData.find(
                    item => item.pk_group === value
                );
                Ajax({
                    url: `/nccloud/platform/appregister/switchgroup.do`,
                    data: {
                        pk_group: value,
                        groupName: selectedGroup.groupName,
                        groupCode: selectedGroup.groupCode
                    },
                    info: {
                        name: langCheck('0000PUB-000109'),/* 国际化处理： 工作桌面*/
                        appcode: "10228888",
                        action: langCheck('0000PUB-000110')/* 国际化处理： 集团切换*/
                    },
                    success: ({ data: { data } }) => {
                        if (data.msg) {
                            this.props.setAccountInfo({ selectedKey: value });
                            // 切换集团清除模板缓存数据
                            this.ckearTempletStorage();
                            // 切换集团之后重新查询业务日期
                            this.refreshThePage();
                        }
                    }
                });
            }
        });
    };
    render() {
        let { groupId, currentData } = this.props;
        let gName = currentData.find(item => item.pk_group == groupId);
        return (
            <div
                field="group-switch"
                fieldname={langCheck('0000PUB-000110')}/* 国际化处理： 集团切换*/
                className={`nc-workbench-group-switch ${
                    this.props.showIcon ? "show-icon" : ""
                }`}
                ref="ncWorkbenchGroupSwitch"
            >
                {this.props.showIcon ? (
                    <GroupSwitch groupName={gName ? gName.groupName : ""} />
                ) : null}
                <Select
                    className="field_group"
                    dropdownClassName="field_group-switch"
                    getPopupContainer={() =>
                        this.refs["ncWorkbenchGroupSwitch"]
                    }
                    value={groupId}
                    style={{ width: 234 }}
                    onChange={this.handleChange}
                >
                    {currentData.map(item => {
                        return (
                            <Option
                                title={item.groupName}
                                key={item.pk_group}
                                value={item.pk_group}
                            >
                                {item.groupName}
                            </Option>
                        );
                    })}
                </Select>
            </div>
        );
    }
}
GroupSelection.propTypes = {
    currentData: PropTypes.array.isRequired,
    groupId: PropTypes.string.isRequired,
    setAccountInfo: PropTypes.func.isRequired
};
export default connect(
    state => ({
        currentData: state.appData.currentData,
        groupId: state.appData.groupId
    }),
    { setAccountInfo }
)(GroupSelection);

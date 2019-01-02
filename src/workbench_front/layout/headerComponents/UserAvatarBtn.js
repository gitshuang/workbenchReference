import React from "react";
import { connect } from "react-redux";
import { Tooltip } from "antd";
import PropTypes from "prop-types";
import {langCheck} from "Pub/js/utils";
import { changeDrawer } from "Store/appStore/action";
/**
 * 用户头像按钮
 */
class UserAvatarBtn extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { isOpen, avatar, changeDrawer, userName } = this.props;
        return (
            <Tooltip placement="bottom" title={userName}>
                <div
                    className="nc-workbench-hp margin-right-10"
                    onClick={() => {
                        changeDrawer(!isOpen);
                    }}
                >
                    <img
                        field="logo"
                        fieldname={langCheck('0000PUB-000031')}/* 国际化处理： 标识*/
                        src={avatar}
                        alt="logo"
                    />
                </div>
            </Tooltip>
        );
    }
}
UserAvatarBtn.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    avatar: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    changeDrawer: PropTypes.func.isRequired
};
export default connect(
    state => ({
        isOpen: state.appData.isOpen,
        avatar: state.appData.avatar,
        userName: state.appData.userName
    }),
    { changeDrawer }
)(UserAvatarBtn);

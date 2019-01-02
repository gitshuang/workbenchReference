import React from "react";
import { withRouter } from "react-router-dom";
import UserAvatarBtn from "./headerComponents/UserAvatarBtn";
import GroupSelection from "./headerComponents/GroupSelection";
import Breadcrumb from "./headerComponents/Breadcrumb/index";
/**
 * workbench 工作桌面头部左侧集合
 */
class HeaderLeft extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="n-v-middle">
                <UserAvatarBtn />
                {this.props.location.pathname === "/" ? (
                    <GroupSelection showIcon = {false}/>
                ) : (
                    <div className="compose-container">
                        <GroupSelection showIcon = {true}/>
                        <span className="block-span margin-right-14" />
                        <Breadcrumb />
                    </div>
                )}
            </div>
        );
    }
}
export default withRouter(HeaderLeft);

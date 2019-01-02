import React from "react";
class GroupSwitch extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="group-switch-container" title={this.props.groupName}>
                <i className="iconfont icon-zuzhi" />
            </div>
        );
    }
}
export default GroupSwitch;

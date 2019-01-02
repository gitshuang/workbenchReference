import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { sprLog } from "./spr";
import RecordIMG from "Assets/images/record.gif";
import {langCheck} from "Pub/js/utils";
class RecordSPR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sprType: true,
            hoverType: false
        };
    }
    /**
     * spr录制
     */
    handleSprClick = () => {
        let { sprType } = this.state;
        sprType = sprLog(sprType, this.props.userId, sprType => {
            localStorage.setItem("spr", sprType);
            this.setState({ sprType });
        });
    };
    /**
     * spr悬停
     */
    handleSprOver = () => {
        this.setState({ hoverType: true });
    };
    handleSprOut = () => {
        this.setState({ hoverType: false });
    };
    handleVisibilityChange =()=>{
        let sprType = localStorage.getItem("spr");
        if (sprType) {
            sprType = JSON.parse(sprType);
            this.setState({ sprType });
        }
    }
    componentDidMount() {
        let sprType = localStorage.getItem("spr");
        if (sprType) {
            sprType = JSON.parse(sprType);
            this.setState({ sprType });
        }
        window.addEventListener(
            "visibilitychange",
            this.handleVisibilityChange
        );
    }
    componentWillReceiveProps(nextProps) {
        let sprType = localStorage.getItem("spr");
        if (sprType) {
            sprType = JSON.parse(sprType);
            this.setState({ sprType });
        }
    }
    componentWillUnmount() {
        window.addEventListener(
            "visibilitychange",
            this.handleVisibilityChange
        );
    }
    render() {
        let { sprType, hoverType } = this.state;
        return (
            <div
                className="spr-record"
                field="spr"
                fieldname={langCheck('0000PUB-000120')}/* 国际化处理： 录制SPR*/
                title={
                    sprType
                        ? langCheck('0000PUB-000121')/* 国际化处理： 开始录制SPR*/
                        : hoverType
                            ? langCheck('0000PUB-000122')/* 国际化处理： 结束录制SPR*/
                            : langCheck('0000PUB-000122')/* 国际化处理： 结束录制SPR*/
                }
                onClick={this.handleSprClick}
                onMouseOver={this.handleSprOver}
                onMouseOut={this.handleSprOut}
            >
                {sprType ? (
                    <i className="iconfont icon-kaishi1" />
                ) : hoverType ? (
                    <i className="iconfont icon-zanting" />
                ) : (
                    <img src={RecordIMG} width="18px" />
                )}
            </div>
        );
    }
}
RecordSPR.propTypes = {
    userId: PropTypes.string.isRequired
};
export default connect(
    state => ({
        userId: state.appData.userId
    }),
    {}
)(RecordSPR);

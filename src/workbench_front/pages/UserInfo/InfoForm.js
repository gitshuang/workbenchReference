import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import AvatarEdit from "./AvatarEdit";
import { langCheck } from "Pub/js/utils.js";
class InfoForm extends Component {
    constructor(props) {
        super(props);
    }
    handleClick = infoType => {
        this.props.infoSetting(infoType);
    };

    render() {
        let { userName, phone, email, json } = this.props;
        return (
            <div className="userinfo-container">
                <div className="userinfo-content">
                    <div className="title info margin-bottom-12">
                        {langCheck(
                            "UserInfo-000020",
                            "pages",
                            json
                        ) /* 国际化处理： 个人信息*/}
                    </div>
                    <div className="item border-bottom picture">
                        <label className="label">
                            {langCheck(
                                "UserInfo-000021",
                                "pages",
                                json
                            ) /* 国际化处理： 头像*/}
                        </label>
                        <div className="item-content">
                            <AvatarEdit json={json} />
                        </div>
                    </div>
                    <div className="item border-bottom name">
                        <label className="label">
                            {langCheck(
                                "UserInfo-000022",
                                "pages",
                                json
                            ) /* 国际化处理： 姓名*/}
                        </label>
                        <div className="item-content">
                            <span>{userName}</span>
                        </div>
                    </div>
                    <div className="title info margin-bottom-12 margin-top-50">
                        {langCheck(
                            "UserInfo-000023",
                            "pages",
                            json
                        ) /* 国际化处理： 账户信息*/}
                    </div>
                    {/* <div className="item border-bottom name">
                        <label className="label">联系电话</label>
                        <div className="item-content">
                            {phone.length > 0 ? (
                                <span>{phone}</span>
                            ) : (
                                <span className="not-setting">
                                    未设置
                                    <i className="iconfont icon-jinggao" />
                                </span>
                            )}
                            <span
                                className="btn"
                                onClick={() => {
                                    this.handleClick("1");
                                }}
                            >
                                {phone.length > 0 ? "修改" : "绑定手机号"}
                            </span>
                        </div>
                    </div> */}
                    <div className="item border-bottom name">
                        <label className="label">
                            {langCheck(
                                "UserInfo-000026",
                                "pages",
                                json
                            ) /* 国际化处理： 邮箱*/}
                        </label>
                        <div className="item-content">
                            {email && email.length > 0 ? (
                                <span>{email}</span>
                            ) : (
                                <span className="not-setting">
                                    {langCheck(
                                        "UserInfo-000027",
                                        "pages",
                                        json
                                    ) /* 国际化处理： 未设置*/}
                                    <i className="iconfont icon-jinggao" />
                                </span>
                            )}
                            <span
                                className="btn"
                                onClick={() => {
                                    this.handleClick("2");
                                }}
                            >
                                {email && email.length > 0
                                    ? langCheck(
                                          "UserInfo-000024",
                                          "pages",
                                          json
                                      )
                                    : langCheck(
                                          "UserInfo-000028",
                                          "pages",
                                          json
                                      ) /* 国际化处理： 修改,绑定邮箱*/}
                            </span>
                        </div>
                    </div>
                    {/* <div className="title margin-bottom-12">
                        <span>账号密码</span>
                    </div> */}
                    <div className="item border-bottom pw">
                        <label className="label">
                            {langCheck(
                                "UserInfo-000007",
                                "pages",
                                json
                            ) /* 国际化处理： 密码*/}
                        </label>
                        <div className="item-content">
                            <span>******</span>
                            <span
                                className="btn"
                                onClick={() => {
                                    this.handleClick("0");
                                }}
                            >
                                {langCheck(
                                    "UserInfo-000024",
                                    "pages",
                                    json
                                ) /* 国际化处理： 修改*/}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
InfoForm.propTypes = {
    userName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
};
export default connect(
    state => ({
        userName: state.appData.userName,
        avatar: state.appData.avatar,
        email: state.appData.email
    }),
    {}
)(InfoForm);

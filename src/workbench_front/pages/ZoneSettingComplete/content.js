import React, { Component } from "react";
import { Icon } from "antd";
import { withRouter } from "react-router-dom";
import { GetQuery, langCheck } from "Pub/js/utils";
import { openPage } from "Pub/js/superJump";
class MyContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let { json } = this.props;
    return (
      <div className="template-setting-content">
        <div className="content">
          <Icon className="complete-icon" type="check-circle" />

          <div>
            <p className="first-text">{langCheck('ZoneSettingComplete-000000', 'pages', json)}</p>
            {/* /* 国际化处理： 应用页面配置完成*/ }
            <a
              onClick={() => {
                let param = GetQuery(this.props.location.search);
                openPage(
                  `/Zone`,
                  false,
                  {
                    pcode: param.pcode,
                    pid: param.pid,
                    appcode: param.appcode
                  },['templetid']
                );
              }}
            >
              {langCheck('ZoneSettingComplete-000001', 'pages', json)}
              {/* /* 国际化处理： 继续新增模板*/ }
            </a>
            <a
              onClick={() => {
                openPage(`/ar`, false, {
                  c: "102202APP",
                  b1: langCheck('ZoneSettingComplete-000002', 'pages', json),/* 国际化处理： 动态建模平台*/
                  b2: langCheck('ZoneSettingComplete-000003', 'pages', json),/* 国际化处理： 开发配置*/
                  b3: langCheck('ZoneSettingComplete-000004', 'pages', json),/* 国际化处理： 应用管理*/
                  n: langCheck('ZoneSettingComplete-000005', 'pages', json)/* 国际化处理： 应用注册*/
                },['templetid','pcode','pid','appcode']);
              }}
            >
              {langCheck('ZoneSettingComplete-000006', 'pages', json)}
              {/* /* 国际化处理： 返回页面配置*/ }
            </a>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(MyContent);

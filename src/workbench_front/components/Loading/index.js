import React, { Component } from "react";
import { Spin } from "antd";
import "./index.less";
export default class Loading extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        className="nc-workbench-loading"
        style={{
          position: "absolute",
          zIndex: "190",
          top:'0'
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
}

import React, { Component } from "react";
import NoData from "Assets/images/nodata.png";
import IDEA from "Assets/images/idea.png";
import { langCheck } from 'Pub/js/utils';
import "./index.less";
class CoverPosition extends Component {
    constructor(props) {
        super(props);
    }
    /**
     * 站位图片选择
     * @param {String} type 站位图片类型 不传走默认
     * 数卡表格站位图片 treeCardTable
     */
    switchImg = (type, langCheck) => {
        switch (type) {
            case "treeCardTable":
                return (
                    <div className="CoverPosition-content-treeCardTable">
                        <img src={IDEA} />
                        <span>{langCheck('0000PUB-000002')}</span>{/* 国际化处理： 暂无数据*/}
                    </div>
                );
            default:
                return (
                    <div className="CoverPosition-content">
                        <img src={NoData} />
                        <span>{langCheck('0000PUB-000002')}</span>{/* 国际化处理： 暂无数据*/}
                    </div>
                );
        }
    };
    render() {
        // let { langCheck } = window;
        return (
            <div className="CoverPosition-container">
                {this.switchImg(this.props.type, langCheck)}
            </div>
        );
    }
}
export default CoverPosition;

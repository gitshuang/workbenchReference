import React, { Component } from "react";
/**
 * 表格单元格浏览态
 */
class EditableCellShow extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        /**
         * @param {String} value 值
         */
        let { value } = this.props;
        return (
            <div style={{ paddingRight: 24 }}>{value}</div>
        );
    }
}
export default EditableCellShow;
import React from "react";
import { Table } from "antd";
import "./index.less";
/**
 * 每列必须固定
 */
class TableScroll extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let width = this.props.columns.reduce(
            (cola, colb) => cola.width + colb.width
        );
        return (
            <div className="suck-table">
                <div className="suck-table-header" id='suckTableHeader'>
                    <div
                        className="suck-table-content"
                        style={{ width: width }}
                    >
                        <Table bordered={false} columns={this.props.columns} />
                    </div>
                </div>
                <div className="suck-table-container" >
                    <div
                        className="suck-table-content"
                        style={{ width: width }}
                    >
                        <Table {...this.props} />
                    </div>
                </div>
            </div>
        );
    }
}
export default TableScroll;

import React, { Component } from 'react';
import { connect } from 'react-redux';
import TemTreeComponent from './temTreeComponent';

class TemplatePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {}
    render() {
        const {dataSource}=this.props;
        return dataSource.length > 0 ? (
            <div className='templateTree-wrap'>
                <p className='template-title'>{this.props.langDataTitle}</p>
                {/* 国际化处理： 页面模板*/}
                <TemTreeComponent dataSource={dataSource} onSelectQuery={this.props.onSelectQuery} />
                
            </div>
        ) : (
            <div className='noPageData'>
                <p className='noDataTip'>{this.props.langNoDataTitle}</p>
                {/* 国际化处理： 该页面无页面模板*/}
            </div>
        );
    }
}

TemplatePage.propTypes = {
};
export default connect(
    (state) => ({}),
    {}
)(TemplatePage);
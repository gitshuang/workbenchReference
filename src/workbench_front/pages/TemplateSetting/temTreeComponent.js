import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    setSelectedTemKeys,
    setExpandedTemKeys,
} from 'Store/TemplateSetting/action';
import { Tree } from 'antd';
import loop from './loop';

class TreeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autoExpandTemParent: false
        };
    }
    componentDidMount() {}
    onExpand = (expandedKeys) => {
        this.props.setExpandedTemKeys(expandedKeys);
        this.setState({
            autoExpandTemParent: false
        });
    };
    //树的双击事件回调方法
    hanldeDoubleClick = (node) => {
        const nodeDataoMduleid = node.props.refData.pk;
        const expandedTemKeys = this.props.expandedTemKeys.concat([ nodeDataoMduleid ]);
        this.props.setExpandedTemKeys(expandedTemKeys);
    };
    onExpand = (expandedKeys) => {
        this.props.setExpandedTemKeys(expandedKeys);
        this.setState({
            autoExpandTemParent: false
        });
    };
    onSelect=(key, e)=>{
        this.props.onSelectQuery(key, e)
    }
    render() {
        const { autoExpandTemParent } = this.state;
        let { dataSource, expandedTemKeys, selectedTemKeys } = this.props;
        return (
            <div className='templateTree'>
                {dataSource.length > 0 && (
                    <Tree
                        showLine
                        showIcon
                        onExpand={(key, node) => {
                            this.onExpand(key, node);
                        }}
                        expandedKeys={expandedTemKeys}
                        onSelect={(key, node) => {
                            this.onSelect(key, node);
                        }}
                        autoExpandParent={autoExpandTemParent}
                        selectedKeys={selectedTemKeys}
                        onDoubleClick={(key, node) => {
                            this.hanldeDoubleClick(node);
                        }}
                    >
                        {loop(dataSource, '')}
                    </Tree>
                )}
            </div>
        );
    }
}

TreeComponent.propTypes = {
    setSelectedTemKeys: PropTypes.func.isRequired,
    setExpandedTemKeys: PropTypes.func.isRequired,
    setTemplateNameVal: PropTypes.func.isRequired,
    selectedTemKeys: PropTypes.array.isRequired,
    expandedTemKeys: PropTypes.array.isRequired
};
export default connect(
    (state) => ({
        selectedTemKeys: state.TemplateSettingData.selectedTemKeys,
        expandedTemKeys: state.TemplateSettingData.expandedTemKeys
    }),
    {
        setSelectedTemKeys,
        setExpandedTemKeys
    }
)(TreeComponent);

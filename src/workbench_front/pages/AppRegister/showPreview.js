import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button } from "antd";
import { updatePreviewData } from "Store/ZoneSetting/action";
import { createPage } from "nc-lightapp-front";
import initTemplate from "./events";
import { langCheck } from 'Pub/js/utils';

class PreviewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            all_keys: []
        };
    }
    showModalHidden = () => {
        this.props.setModalVisibel(false);
    };
    componentWillMount = () => {
        let { langJson } = this.props;
        initTemplate.call(this, this.props, langJson); 
    };
    onOkDialog = () => {
        this.props.setModalVisibel(false);
    };
    createDom = () => {
        let { editTable, form, search, langJson } = this.props;
        let { createForm } = form;
        let { createEditTable } = editTable;
        let { NCCreateSearch } = search;
        let { forms, tables, searchs, all_keys } = this.state;
        let result = [];
        if (all_keys.length) {
            all_keys.map((val, i) => {
                switch (val.myAreaType) {
                    case 'form':
                        result.push(
                            <div className="viewTemplateArea" key={`form${i}`}>
                                <div className="descrip">
                                    <span key={`forms${i}`}> ▼ </span>
                                    {`${langCheck('102202APP-000146',"pages", langJson)}${i + 1}_${val.name}`}{/* 国际化处理： 表单区*/}
                                </div>
                                {createForm(val.id)}
                            </div>
                        );
                        break;
                    case 'table':
                        result.push(
                            <div className="viewTemplateArea" key={`table${i}`}>
                                <div className="descrip">
                                    <span key={`tables${i}`}> ▼ </span>
                                    {`${langCheck('102202APP-000147',"pages", langJson)}${i + 1}_${val.name}`}{/* 国际化处理： 表格区*/}
                                </div>
                                {createEditTable(val.id, {})}
                            </div>
                        );
                        break;
                    case 'search':
                        result.push(
                            <div
                                className="viewTemplateArea"
                                key={`search${i}`}
                            >
                                <div className="descrip">
                                    <span key={`searchs${i}`}> ▼ </span>
                                    {`${langCheck('102202APP-000148',"pages", langJson)}${i + 1}_${val.name}`}{/* 国际化处理： 查询区*/}
                                </div>
                                {NCCreateSearch(val.id)}
                            </div>
                        );
                        break;
                    default:
                        break;
                }
            });
        }
        return result;
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.previewData) {
            let reviewData = nextProps.previewData;
            let all_keys = []
            reviewData.forEach((v, i) => {
                if (
                    Object.keys(v) &&
                    v[Object.keys(v)[0]] &&
                    v[Object.keys(v)[0]].moduletype
                ) {
                    let key = v[Object.keys(v)[0]].moduletype;
                    let name = v[Object.keys(v)[0]].name;
                    if (key === 'table' || key === 'form' || key === 'search') {
                        all_keys.push({
                            id: Object.keys(v)[0],
                            name: name,
                            myAreaType: key
                        });
                    }
                }
            });
            this.setState({
                all_keys
            });
        }
    }
    render() {
        let { editTable, form, search, langJson } = this.props;
        return (
            <Modal
                maskClosable={false}
                title={langCheck('102202APP-000145',"pages", langJson)}/* 国际化处理： 预览区*/
                mask={false}
                visible={this.props.batchSettingModalVisibel}
                onOk={this.onOkDialog}
                onCancel={this.showModalHidden}
                width="95%"
                className='viewPageTem'
                footer={null}
            >
                {this.createDom()}
            </Modal>
        );
    }
}

PreviewModal = createPage({
    initTemplate: initTemplate
})(PreviewModal);

export default connect(
    state => {
        return {
            areaList: state.zoneSettingData.areaList,
            previewData: state.zoneSettingData.previewData
        };
    },
    {
        updatePreviewData
    }
)(PreviewModal);

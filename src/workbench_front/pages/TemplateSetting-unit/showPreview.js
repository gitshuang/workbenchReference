import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { updatePreviewData } from 'Store/ZoneSetting/action';
import { createPage } from 'nc-lightapp-front';
import initTemplate from './events';
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
    onOkDialog = () => {
        this.props.setModalVisibel(false);
    };
    componentWillMount = () => {
        let { langJson } = this.props;
        initTemplate.call(this, this.props, langJson); 
    };
    createDom = () => {
        let { editTable, form, search, langJson } = this.props;
        let { createForm } = form;
        let { createEditTable } = editTable;
        let { NCCreateSearch } = search;
        let result = [];
        let { all_keys } = this.state;
        if (all_keys.length) {
            all_keys.map((val, i) => {
                switch (val.myAreaType) {
                    case 'form':
                        result.push(
                            <div className='viewTemplateArea' key={`form${i}`}>
                                <div className='descrip'>
                                    <span key={`forms${i}`}> ▼ </span>
                                    {`${langCheck('10181TM-000058',"pages", langJson)}${i + 1}_${val.name}`}
                                    {/*10181TM-000058*/}
                                    {/* 国际化处理： 表单区*/}
                                </div>
                                {createForm(val.id)}
                            </div>
                        );
                        break;
                    case 'table':
                        result.push(
                            <div className='viewTemplateArea' key={`table${i}`}>
                                <div className='descrip'>
                                    <span key={`tables${i}`}> ▼ </span>
                                    {`${langCheck('10181TM-000060',"pages", langJson)}${i + 1}_${val.name}`}
                                    {/* 国际化处理： 表格区*/}
                                </div>
                                {createEditTable(val.id, {})}
                            </div>
                        );
                        break;
                    case 'search':
                        result.push(
                            <div className='viewTemplateArea' key={`search${i}`}>
                                <div className='descrip'>
                                    <span key={`searchs${i}`}> ▼ </span>
                                    {`${langCheck('10181TM-000059',"pages", langJson)}${i + 1}_${val.name}`}
                                    {/* 国际化处理： 查询区*/}
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
            let all_keys=[];
            reviewData.forEach((v, i) => {
                if (Object.keys(v) && v[Object.keys(v)[0]] && v[Object.keys(v)[0]].moduletype) {
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
                title={langCheck('10181TM-000061',"pages", langJson)} //页面模板预览
                mask={false}
                visible={this.props.batchSettingModalVisibel}
                onOk={this.onOkDialog}
                onCancel={this.showModalHidden}
                width='95%'
                footer={null}
                centered={true}
                className='viewPageTem'
            >
                {this.createDom()}
            </Modal>
        );
    }
}

PreviewModal = createPage({
    initTemplate: initTemplate,
    mutiLangCode: '10181TM'
})(PreviewModal);

export default connect(
    (state) => {
        return {
            areaList: state.zoneSettingData.areaList,
            previewData: state.zoneSettingData.previewData
        };
    },
    {
        updatePreviewData
    }
)(PreviewModal);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { updatePreviewData } from 'Store/ZoneSetting/action';
import { createPage } from 'nc-lightapp-front';
import { langCheck } from 'Pub/js/utils';
import initTemplate from './events';

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
        //let multiLang = this.props.MutiInit.getIntl('10180TM');
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
                                    {`${langCheck('10180TM-000051', "pages", langJson)}${i + 1}_${val.name}`} {/* 国际化处理： 表单区*/}
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
                                    {`'${langCheck('10180TM-000053', "pages", langJson)}${i + 1}_${val.name}`}
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
                                    {`${langCheck('10180TM-000052', "pages", langJson)}${i + 1}_${val.name}`}
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
            let all_keys = [];
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
                all_keys: all_keys
            });
        }
    }
    render() {
        // if (!this.props.MutiInit.getIntl('10180TM')) {
        //     return null;
        // }
        let { langJson } = this.props;
        return (
            <Modal
                mask={true}
                title={langCheck('10180TM-000054', "pages", langJson)} //页面模板预览
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
    initTemplate: initTemplate
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

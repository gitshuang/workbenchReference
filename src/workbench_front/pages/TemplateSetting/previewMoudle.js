import React, { Component } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { langCheck } from 'Pub/js/utils';
import Ajax from 'Pub/js/ajax.js';

class PreviewMoudle extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    //浏览摸态框隐藏方法
    hideModal = () => {
        this.props.hideModal(false)
    };
    componentDidMount(){
        this.printModalAjax(this.props.templatePk);
    }
    //打印模板预览请求数据方法
    printModalAjax = (templateId) => {
        let {json}=this.props;
        let infoData = {};
        infoData.templateId = templateId;
        const url = `/nccloud/platform/template/previewPrintTemplate.do`;
        Ajax({
            url: url,
            data: infoData,
            info: {
                name: langCheck('10180TM-000012', "pages", json) /* 国际化处理： 模板设置*/,
                action: langCheck('10180TM-000025', "pages", json) /* 国际化处理： 模板复制*/
            },
            success: ({ data }) => {
                if (data.success) {
                    document.getElementsByClassName('printContent')[0].innerHTML = data.data;
                }
            }
        });
    };
    render() {
        const {previewPrintVisible, json}=this.props;
        return  (
            <div className='templateTree-wrap'>
                <Modal
                    title={langCheck('10180TM-000050', "pages", json)} /* 国际化处理： 打印模板预览*/
                    okText={langCheck('10180TM-000015', "pages", json)} /* 国际化处理： 确定*/
                    cancelText={langCheck('10180TM-000016', "pages", json)} /* 国际化处理： 取消*/
                    visible={previewPrintVisible}
                    onCancel={this.hideModal}
                    maskClosable={false}
                    footer={null}
                    centered={true}
                    width='calc(100vw - 64px)'
                    className='viewPageTem'
                >
                    <div className='printContent'></div>
                </Modal>
            </div>
        ) 
    }
}

PreviewMoudle.propTypes = {
    json: PropTypes.object.isRequired,
    templatePk: PropTypes.string.isRequired
};
export default connect(
    (state) => ({
        json: state.TemplateSettingData.json,
        templatePk: state.TemplateSettingData.templatePk
    }),
    {}
)(PreviewMoudle);
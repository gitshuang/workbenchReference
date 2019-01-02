import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Input, Icon, Modal, Button } from 'antd';
import * as utilService from './utilService';
import { updatePreviewData } from 'Store/ZoneSetting/action';
import { createPage } from 'nc-lightapp-front';
import initTemplate from './events';
import { langCheck } from "Pub/js/utils";
import { getMulti } from 'Pub/js/getMulti';
//预览模态框组件类
//注：未作修改
class PreviewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            all_keys: [],
            json: {}
        };
    }
    //隐藏预览模态框
    showModalHidden = () => {
        this.props.setModalVisibel(false);
    };
    //创建预览内容的DOM结构
    createDom = () => {
        let { editTable, form, search } = this.props;
        let { createForm } = form;
        let { createEditTable } = editTable;
        let { NCCreateSearch } = search;

        let { all_keys } = this.state;
        let result = [];

        // // 查询区
        // if (searchs.length) {
        //     searchs.map((val, i) => {
        //         result.push(
        //             <div className="viewTemplateArea" >
        //                 <div className="descrip">
        //                     <span> ▼ </span>
        //                     {`查询区${i + 1}_${val.name}`}
        //                 </div>
        //                 {NCCreateSearch(val.id)}
        //             </div>
        //         );
        //     });
        // }

        // 所有预览
        if (all_keys.length) {
            all_keys.map((val, i) => {
                switch (val.myAreaType) {
                    case 'form':
                        result.push(
                            <div className="viewTemplateArea" key={`form${i}`}>
                                <div className="descrip">
                                    <span key={`forms${i}`}> ▼ </span>
                                    {`${val.name}`}
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
                                    {`${val.name}`}
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
                                    {`${val.name}`}
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
            console.log('reviewData', reviewData);
            let all_keys = [];
            reviewData.forEach((v, i) => {
                console.log('Object.keys(v)', Object.keys(v));
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
            //  更新state;
            this.setState({
                all_keys: all_keys
            });
        }
    }
    componentWillMount = () => {
        let { json } = this.state;
        initTemplate.call(this, this.props, json); 
    };
    componentDidMount() {
        //多语
        let callback = (json) => {
			// console.log('json', json);
            this.setState({
                json:json
            });
        };
        getMulti({
            moduleId: 'ZoneSetting',
            // currentLocale: 'zh-CN',
            domainName: 'workbench',
            callback
        });
    }

    render() {
        /* let { editTable, form, search } = this.props;
		let { createForm } = form;
		let { createEditTable } = editTable;
        let { NCCreateSearch } = search; */
        let { json } = this.state;
        return (
            <Modal
                maskClosable={false}
                title={langCheck('ZoneSetting-000121', 'pages', json)}/* 国际化处理： 预览区*/
                mask={false}
                visible={this.props.previewVisibel}
                onOk={this.onOkDialog}
                onCancel={this.showModalHidden}
                width="80%"
                className="viewPageTem"
                centered={true}
                footer={null}
                // footer={[
                //     <Button
                //         key="submit"
                //         type="primary"
                //         onClick={this.showModalHidden}
                //     >
                //         确定
                //     </Button>,
                //     <Button key="back" onClick={this.showModalHidden}>
                //         取消
                //     </Button>
                // ]}
            >
                {this.createDom()}
                {/* {this.previewBrowseDom()} */}
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

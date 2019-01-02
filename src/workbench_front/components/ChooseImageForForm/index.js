import React, { Component } from 'react';
import { Modal } from 'antd';
import appIcons from 'Pub/js/appIcons';
import ImgList from './ImgList';
import { langCheck } from 'Pub/js/utils';
import './index.less';
class ChooseImageForForm extends Component {
    static defaultProps = {
        isedit: true
    };
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            selected: '',
            listData: [],
            value: ''
        };
        this.value = '';
    }
    showModal = () => {
        // 当当前单据或者组件为可编辑时
        if (this.props.isedit) {
            this.setState({
                visible: true
            });
        }
    };
    handleOk = (e) => {
        let { value } = this.state;
        this.value = value;
        this.setState(
            {
                visible: false
            },
            this.triggerChange(value)
        );
    };
    handleCancel = (e) => {
        let { listData, value } = this.state;
        value = this.value;
        listData = this.updateListData(listData, value);
        this.setState({
            visible: false,
            value,
            listData
        });
    };
    handleSelect = (item) => {
        console.log(item);
        let { listData, value } = this.state;
        value = item.value;
        listData = this.updateListData(listData, value);
        this.setState({
            listData,
            value
        });
    };
    /**
     * 与 antd form 表单传递数据的方法
     * @param {String} changeValue  改变的 value 值
     */
    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(changedValue);
        }
    };
    /**
     * 更新图标列表数据
     * @param {Array} listData 旧的图标列表数据
     * @param {String} value 选中的图标value值
     */
    updateListData = (listData, value) => {
        return (listData = listData.map((item, index) => {
            item.iconList.map((child) => {
                child.selected = false;
                if (child.value === value) {
                    child.selected = true;
                }
                return child;
            });
            return item;
        }));
    };
    componentWillReceiveProps(nextProps) {
        let { data, value } = nextProps;
        this.value = value;
        let listData = this.updateListData(data, value);
        this.setState({
            listData,
            value
        });
    }
    componentWillMount() {
        let { data, value } = this.props;
        this.value = value;
        let listData = this.updateListData(data, value);
        this.setState({
            listData,
            value
        });
    }
    render() {
        let { listData, value } = this.state;
        // let { langCheck } = window;
        if (!value) {
            value = '';
        }
        return (
            <div className='choose-imgae'>
                {value.indexOf('/') === -1 ? (
                    <div
                        onClick={this.props.isedit ? this.showModal : null}
                        className='choose-btn'
                        style={
                            value.length > 0 ? (
                                {
                                    background: `url(${appIcons[value]}) no-repeat 0px 0px`,
                                    backgroundSize: 'contain'
                                }
                            ) : null
                        }
                    >
                        {this.props.isedit ? <i className='iconfont icon-tianjiayingyong font-size-80' /> : null}
                    </div>
                ) : (
                    <div
                        className='choose-btn'
                        style={
                            value.length > 0 ? (
                                {
                                    background: `url(${value}) no-repeat 0px 0px`,
                                    backgroundSize: 'contain'
                                }
                            ) : null
                        }
                        onClick={this.props.isedit ? this.showModal : null}
                    >
                        {this.props.isedit ? <i className='iconfont icon-tianjiayingyong font-size-80' /> : null}
                    </div>
                )}
                <Modal
                    maskClosable={false}
                    closable={false}
                    width={700}
                    title={this.props.title}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText={langCheck('0000PUB-000000')} /* 国际化处理： 取消*/
                    okText={langCheck('0000PUB-000001')} /* 国际化处理： 确定*/
                >
                    {listData.map((item) => <ImgList iconListData={item} onSelected={this.handleSelect} />)}
                </Modal>
            </div>
        );
    }
}
export default ChooseImageForForm;

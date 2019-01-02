import React, { Component } from "react";
import _ from "lodash";
import Ajax from "Pub/js/ajax";
import { connect } from "react-redux";
import { Modal, Button, Select, Checkbox } from "antd";
import { langCheck } from "Pub/js/utils";
import { getMulti } from 'Pub/js/getMulti';
const Option = Select.Option;
//参照模态框组件类
class ReferModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pk_refinfo: "",
            refname: this.props.refname,
            iscode: this.props.iscode,
            option: [],
            json: {}
        };
        this.onOkDialog = this.onOkDialog.bind(this);
    }
    //ajax查询所有的参照
    componentWillReceiveProps(nextProps) {
        let { json } = this.state;
        if (nextProps.modalVisibel !== true) {
            return;
        } else {
            let dataval = this.props.dataval;
            if (!_.isEmpty(dataval)) {
                let pk_refinfo = dataval.split(",")[0];
                this.setState({
                    pk_refinfo: pk_refinfo,
                    refname: nextProps.refname,
                    iscode: nextProps.iscode
                });
            }
            let url, data;
            url = "/nccloud/platform/templet/queryrefinfo.do";
            data = {
                defdoc: nextProps.selectCard && nextProps.selectCard.metaid
            };
            Ajax({
                url: url,
                data: data,
                info: {
                    name: langCheck('ZoneSetting-000062', 'pages', json),/* 国际化处理： 参照*/
                    action: langCheck('ZoneSetting-000063', 'pages', json)/* 国际化处理： 查询参照*/
                },
                success: ({ data }) => {
                    if (data.success && data.data) {
                        this.setState({ option: data.data });
                    } else {
                        Notice({ status: "error", msg: data.data.true });
                    }
                }
            });
        }
    }
    //设置参照模态框隐藏
	showModalHidden = () => {
		this.props.setModalVisibel('referModalVisibel', false);
	};
	async  onOkDialog(){
        let { refname, iscode, pk_refinfo, option, json } = this.state;
		const mycode = iscode ? 'Y' : 'N';
		const filterOption = _.filter(option,(o)=>{
			return o.pk_refinfo === pk_refinfo
		})
		if(filterOption){
			await this.props.handleSelectChange(filterOption[0].refpath, "refcode");
		}
        //设置参照refname
        await this.props.handleSelectChange(refname, "refname");
        // 设置参照名称
        await this.props.handleSelectChange(
            `${pk_refinfo},code=${mycode}`,
            "dataval"
        );
        // 设置iscode
        await this.props.handleSelectChange(iscode, "iscode");
        //classid传值
        // let classid = this.props.selectCard.metaid;
        Ajax({
            url: `/nccloud/platform/templet/getMetaByRefName.do`,
            info: {
                scode: langCheck('ZoneSetting-000064', 'pages', json),/* 国际化处理： 关联元数据*/
                action: langCheck('ZoneSetting-000065', 'pages', json)/* 国际化处理： 获取元数据数据*/
            },
            data: {
                iscode: mycode,
                refname: refname
                // classid: classid  todo
            },
            success: res => {
                if (res) {
                    let { data, success } = res.data;
                    if (success && data) {
                        // 设置元数据属性
                        this.props.handleSelectChange(data, "metadataproperty");
                    }
                }
            }
        });
        this.showModalHidden();
    }
    //选择参照
    handleSelectChange = (pk_refinfo, name) => {
        this.setState({ pk_refinfo: pk_refinfo, refname: name });
    };
    //勾选设置iscode
    checkboxChange = (e, type) => {
        let val;
        val = e.target.checked;
        this.setState({ iscode: val });
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
        let { iscode, option, refname, pk_refinfo, json } = this.state;
        // console.log(refname, iscode, this.props.selectCard);
        return (
            <div className="myZoneModal">
                <Modal
                    closable={false}
                    title={langCheck('ZoneSetting-000066', 'pages', json)}/* 国际化处理： 参照类型设置*/
                    mask={false}
                    wrapClassName="zonesetting-referModal"
                    visible={this.props.modalVisibel}
                    onOk={this.onOkDialog}
                    destroyOnClose={true}
                    onCancel={this.showModalHidden}
                    footer={[
                        <Button
                            key="submit"
                            // disabled={}
                            type="primary"
                            onClick={this.onOkDialog}
                        >
                            {langCheck('ZoneSetting-000005', 'pages', json)}
                            {/* /* 国际化处理： 确定*/ }
                        </Button>,
                        <Button key="back" onClick={this.showModalHidden}>
                            {langCheck('ZoneSetting-000006', 'pages', json)}
                            {/* /* 国际化处理： 取消*/ }
                        </Button>
                    ]}
                >
                    <div>
                        <div className="descrip_label">{langCheck('ZoneSetting-000067', 'pages', json)} </div>
                        {/* /* 国际化处理： 参照设置*/ }
                        <div className="mdcontent">
                            <div>
                                <span className="refer_label">{langCheck('ZoneSetting-000068', 'pages', json)}</span>
                                {/* /* 国际化处理： 参照选择:*/ }
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    value={pk_refinfo}
                                    onChange={(value, optionObj) => {
										console.log(value,optionObj)
                                        this.handleSelectChange(
                                            value,
                                            optionObj.props.children
                                        );
                                    }}
                                    style={{ width: 200 }}
                                >
                                    {option.map((c, index) => {
                                        return (
                                            <Option
                                                key={index}
                                                value={c.pk_refinfo}
                                            >
                                                {c.name}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="descrip_label">{langCheck('ZoneSetting-000069', 'pages', json)} </div>
                        {/* /* 国际化处理： 关联设置*/ }
                        <div className="mdcontent">
                            <div>
                                <span className="refer_label">
                                    {langCheck('ZoneSetting-000070', 'pages', json)}
                                    {/* /* 国际化处理： 焦点离开后参照显示编码:*/ }
                                </span>
                                <Checkbox
                                    checked={iscode}
                                    onChange={e => {
                                        this.checkboxChange(e);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
export default connect(
    state => ({
        selectCard: state.zoneSettingData.selectCard
    }),
    {}
)(ReferModal);

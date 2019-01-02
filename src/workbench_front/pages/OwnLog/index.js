import React, { Component } from 'react';
import * as platform from 'nc-lightapp-front';
import { PageLayout } from 'Components/PageLayout';
import SliderModal from './SliderModal';
import Ajax from 'Pub/js/ajax';
import { langCheck } from 'Pub/js/utils';
import { getMulti } from 'Pub/js/getMulti';
import './index.less';
import Notice from "Components/Notice";
const { createPage, base, print, toast } = platform;
const { NCButton, NCTabs } = base;
const NCTabPane = NCTabs.NCTabPane;
let oidsObj = {};
class OwnLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			key: '10220PLOG_enterlog',
			flag: false, //侧拉
			record: null, // 侧拉数据
			printBtnDisabled: true,
			langJson: {} //打印按钮可用性
		};
	}
	componentWillMount = () => {
		let callback = (json) => {
			this.setState({
				langJson: json
			});
		};
		getMulti({
			moduleId: 'OwnLog',
			domainName: 'workbench',
			callback
		});
	};
	componentDidMount() {
		this.getData();
		//把nc-lightapp-front暴露给全局，供全局使用（艺轩）
		window['nc-lightapp-front'] = platform;
	}
	/**
     * tab切换获取数据
     */
	getData = () => {
		const { key } = this.state;
		const { createUIDom } = this.props;
		createUIDom(
			{
				appcode: '10220PLOGG',
				pagecode: key
			},
			this.callbackFun
		);
	};
	/**
     * 渲染表格查询区
     */
	callbackFun = (templedata) => {
		if (templedata) {
			if (templedata.template) {
				let meta = templedata.template;
				meta = this.modifier(meta, this.props, this);
				this.props.meta.setMeta(meta);
			}
			if (templedata.button) {
				let button = templedata.button;
				this.props.button.setButtons(button);
			}
		}
		if (this.state.key == '10220PLOG_passwordlog') {
			this.searchBtnClick();
		}
	};
	/**
     * 操作列
     */
	modifier = (meta, props, that) => {
		const { key, langJson } = this.state;
		//添加表格操作列
		let lastest = {
			label: langCheck('OwnLog-000000', 'pages', langJson) /* 国际化处理： 操作*/,
			attrcode: 'opr',
			itemtype: 'customer',
			width: '50px',
			visible: true,
			render(text, record, index) {
				return (
					<div>
						<a className="opr-col" onClick={that.watchDetails.bind(this, record)}>
							{langCheck('OwnLog-000009', 'pages', langJson)}
							{/* 国际化处理： 查看*/}
						</a>
					</div>
				);
			}
		};
		let firstest = {
			label: langCheck('OwnLog-000001', 'pages', langJson) /* 国际化处理： 序号*/,
			attrcode: 'num',
			itemtype: 'customer',
			width: '50px',
			visible: true,
			render(text, record, index) {
				return <div>{index + 1}</div>;
			}
		};
		if (key == '10220PLOG_busilog') {
			meta.grid.items.push(lastest);
		}
		meta.grid.items.unshift(firstest);
		meta.grid.pagination = true;
		return meta;
	};

	/**
     * tab切换
     */
	tabChange = (key) => {
		this.props.table.setAllTableData('grid', {
			rows: [],
			pageInfo: { pageIndex: '0', pageSize: '10' }
		});
		this.props.meta.setMeta('');
		this.closeSlider();
		this.setState(
			{
				key,
				printBtnDisabled: true
			},
			() => this.getData()
		);
	};
	/**
     * 查询
     */
	searchBtnClick = (type, pks) => {
		const { key, langJson } = this.state;
		const { search, table, meta } = this.props;
		const { setAllTableData } = table;
		let dataParam;
		let url;
		switch (key) {
			case '10220PLOG_enterlog':
				url = '/nccloud/platform/log/queryenterlog.do';
				break;
			case '10220PLOG_operatelog':
				url = '/nccloud/platform/log/queryoperatelog.do';
				break;
			case '10220PLOG_busilog':
				url = '/nccloud/platform/log/querybusilog.do';
				break;
			case '10220PLOG_passwordlog':
				url = '/nccloud/platform/log/queryuserpasswordlog.do';
				break;
		}
		if (meta.getMeta().search) {
			let searchData = search.getQueryInfo('search');
			if (searchData.querycondition == false || searchData.querycondition == undefined) {
				return;
			}
		}
		if (key == '10220PLOG_passwordlog') {
			dataParam = {};
		} else {
			dataParam = search.getQueryInfo('search');
		}
		dataParam.pageInfo = table.getTablePageInfo('grid');
		if (type == 'pageChange') {
			dataParam.pageInfo.pagepks = pks;
		} else {
			dataParam.pageInfo.pageIndex = 0;
		}
		Ajax({
			url,
			data: dataParam,
			info: {
				name: langCheck('OwnLog-000013', 'pages', langJson) /* 国际化处理： 首页*/,
				action: langCheck('OwnLog-000003', 'pages', langJson) /* 国际化处理： 首页加载*/,
				appcode: '10220PLOGG'
			},
			success: ({ data }) => {
				if (this.state.key == '10220PLOG_passwordlog') meta.getMeta()['grid'].pagination = false;
				if (data.data !== null && data.data.grid) {
					if (data.data.grid.rows && data.data.grid.rows.length > 0) {
						this.setState({
							printBtnDisabled: false
						});
					}
					setAllTableData('grid', data.data.grid);
					oidsObj = { [key]: data.data.grid.allpks };
					if(this.state.key !== '10220PLOG_passwordlog'){
						Notice({ 
							status: "success", 
							msg: `${langCheck('OwnLog-000014', 'pages', langJson)}${data.data.grid.pageInfo.total}${langCheck('OwnLog-000015', 'pages', langJson)}`/* 国际化处理： 查询成功，共 条。*/
						});
					}
				} else {
					this.setState({
						printBtnDisabled: true
					});
					setAllTableData('grid', {
						rows: [],
						pageInfo: {
							pageIndex: '0',
							pageSize: dataParam.pageInfo.pageSize,
							total: '',
							totalPage: '1'
						}
					});
					oidsObj = { [key]: [] };
					if(this.state.key !== '10220PLOG_passwordlog'){
						Notice({ status: "warning", msg: langCheck('OwnLog-000016', 'pages', langJson) });/* 国际化处理：未查询出符合条件的数据！*/
					}
				}
			}
		});
	};
	/**
     * 分页
     */
	handlePageInfoChange = (props, config, pks) => {
		this.searchBtnClick('pageChange', pks);
	};
	/**
     * 打印
     */
	onPrint = () => {
		const { key } = this.state;
		const { table } = this.props;
		let nodekey, url, oids;
		let pageInfo = table.getTablePageInfo('grid');
		if (!Object.keys(oidsObj)[0] == key) {
			return;
		} else {
			oids = this.pickOidsFun(oidsObj[key], pageInfo);
		}
		switch (key) {
			case '10220PLOG_enterlog':
				nodekey = 'enterlog';
				url = '/nccloud/platform/log/printenterlog.do';
				break;
			case '10220PLOG_operatelog':
				url = '/nccloud/platform/log/printoperatelog.do';
				nodekey = 'operatelog';
				break;
			case '10220PLOG_busilog':
				nodekey = 'busilog';
				url = '/nccloud/platform/log/printbusilog.do';
				break;
			case '10220PLOG_passwordlog':
				nodekey = 'userpasswordlog';
				url = '/nccloud/platform/log/printuserpasswordlog.do';
				break;
		}
		print(
			'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
			`${url}`, //后台服务url
			{
				funcode: '10220PLOGG', //小应用编码
				nodekey, //模板节点标识
				appcode: '10220PLOGG',
				oids // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印
			}
		);
	};
	/**
     * 处理oids
     */
	pickOidsFun = (oids, pageInfo) => {
		if (pageInfo.pageSize >= oids.length) {
			return oids;
		} else {
			let start = pageInfo.pageIndex * pageInfo.pageSize;
			let end = (Number(pageInfo.pageIndex) + 1) * pageInfo.pageSize;
			oids = oids.slice(start, end);
			return oids;
		}
	};

	/**
		 * 参照过滤
		 */
	onAfterEvent = (field, val) => {
		let meta = this.props.meta.getMeta();
		if (field == 'typepk_busiobj') {
			meta.search.items.find((item) => item.attrcode == 'pk_operation').queryCondition = () => {
				return {
					metaId: val.refpk
				};
			};
		}
		this.props.meta.setMeta(meta);
	};
	/**
     * 查看侧拉
     */
	watchDetails = (record) => {
		this.setState({
			flag: true,
			record
		});
	};
	/**
     * 行点击事件
     */
	onRowClick = (props, moduleId, record, index, event) => {
		this.setState({
			record
		});
	};
	closeSlider = () => {
		this.setState({
			flag: false
		});
	};

	pageback = () => {
		this.props.history.push('/');
	};

	render() {
		let { key, flag, record, printBtnDisabled, langJson } = this.state;
		let { search, table } = this.props;
		const { NCCreateSearch } = search; //引入创建查询方法
		const { createSimpleTable } = table;
		return (
			<PageLayout>
				<div className="workbench-ownlog-log">
					<div className="header">
						<div className="header-left">
							<i className="iconfont icon-fanhuishangyiji" onClick={this.pageback} />
							<h3>{langCheck('OwnLog-000002', 'pages', langJson)}</h3>
							{/* 国际化处理： 个人日志*/}
						</div>
						<NCButton style={{ fontSize: '14px' }} disabled={printBtnDisabled} onClick={this.onPrint}>
							{langCheck('OwnLog-000004', 'pages', langJson)}
							{/* 国际化处理： 打印*/}
						</NCButton>
					</div>
					<div className="content">
						<div className="tabs">
							<NCTabs
								navtype="turn"
								contenttype="moveleft"
								tabBarPosition="top"
								defaultActiveKey={key}
								onChange={this.tabChange}
							>
								<NCTabPane
									tab={langCheck('OwnLog-000005', 'pages', langJson)}
									key="10220PLOG_enterlog"
								/>
								{/* 国际化处理：系统登录日志*/}

								<NCTabPane
									tab={langCheck('OwnLog-000006', 'pages', langJson)}
									key="10220PLOG_operatelog"
								/>
								{/* 国际化处理：功能操作日志*/}
								<NCTabPane
									tab={langCheck('OwnLog-000007', 'pages', langJson)}
									key="10220PLOG_busilog"
								/>
								{/* 国际化处理： 业务日志*/}
								<NCTabPane
									tab={langCheck('OwnLog-000008', 'pages', langJson)}
									key="10220PLOG_passwordlog"
								/>
								{/* 国际化处理：密码重置记录*/}
							</NCTabs>
						</div>
						<div className="log-search-area">
							{NCCreateSearch('search', {
								clickSearchBtn: this.searchBtnClick,
								showAdvBtn: false,
								onAfterEvent: this.onAfterEvent
							})}
						</div>
						<div>
							{createSimpleTable('grid', {
								onRowClick: this.onRowClick,
								handlePageInfoChange: this.handlePageInfoChange
							})}
						</div>
					</div>
				</div>
				<SliderModal
					langJson={langJson}
					record={record}
					flag={flag}
					onChange={(flag) => {
						this.setState({ flag });
					}}
				/>
			</PageLayout>
		);
	}
}
const OwnLogInfo = createPage({})(OwnLog);
export default OwnLogInfo;

import React, { Component } from 'react';
import _ from 'lodash';
import './index.less';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { updateShadowCard, updateGroupList, updateCurrEditID, updateLayout } from 'Store/test/action';
//自定义组件
import { layoutCheck } from './collision';
import { compactLayout, compactLayoutHorizontal } from './compact';
import * as utilService from './utilService';
import GroupItem from './groupItem';
import MyContentAnchor from './anchor';
import MyFooter from './footer';
import { scroller } from 'react-scroll';
import { DeferFn } from "Pub/js/utils";
//内容组件类
class MyContent extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	/*
	 * 工作桌面 用户桌面设置 页面
	 * 关于卡片在组内的操作
	 */
	/**
	 * 拖拽中卡片在组上移动
	 * @param {Object} dragItem 拖拽中的对象
	 * @param {Object} hoverItem 拖拽中鼠标悬浮的对象
	 * @param {Number} x 当前元素所在的网页的x轴位置，单位为px
	 * @param {Number} y 当前元素所在的网页的y轴位置，单位为px
	**/
	moveCardInGroupItem = (dragItem, hoverItem, x, y) => {
		// debugger
		let axis = 'gridx';
		let groups = this.props.groups;
		let shadowCard = this.props.shadowCard;
		const { margin, containerWidth, col, rowHeight } = this.props.layout;
		//计算当前所在的网格坐标
		const { gridX, gridY } = utilService.calGridXY(x, y, shadowCard.width, margin, containerWidth, col, rowHeight);
		if (gridX === shadowCard.gridx && gridY === shadowCard.gridy) {
			return;
		}
		let groupIndex = hoverItem.index;
		//先判断组内是否存在相同的卡片
		const cardid = shadowCard.cardid;
		const isContain = utilService.checkCardContainInGroup(groups[groupIndex], cardid);

		if (isContain) {
			return;
		}
		//删除阴影的卡片
		_.forEach(groups, (g, index) => {
			_.remove(g.apps, (a) => {
				return a.isShadow === true;
			});
		});

		shadowCard = { ...shadowCard, gridx: gridX, gridy: gridY };
		//添加阴影的卡片
		groups[groupIndex].apps.push(shadowCard);
		//获得当前分组内最新的layout布局
		const newlayout = layoutCheck(
			groups[groupIndex].apps,
			shadowCard,
			shadowCard.cardid,
			shadowCard.cardid,
			axis
		);
		//压缩当前分组内的layout布局
		let compactedLayout;
		if(axis === 'gridx'){
			compactedLayout = compactLayoutHorizontal(newlayout, this.props.col, cardid);
		}else if(axis === 'gridy'){
			compactedLayout = compactLayout(newlayout, shadowCard);
		}
		//更新group对象
		groups[groupIndex].apps = compactedLayout;
		this.props.updateShadowCard(shadowCard);
		this.props.updateGroupList(groups);
	};
	/**
	 * 释放卡片到分组
	 * @param {Object} dragItem 拖拽的卡片对象
	 * @param {Object} dropItem 释放的目标组对象
	**/
	onCardDropInGroupItem = (dragItem, dropItem) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		//将所有分组内的阴影卡片设为非阴影
		utilService.setPropertyValueForCards(groups, 'isShadow', false);
		//目标组内重新横向压缩布局
		_.forEach(groups, (g, targetGroupIndex) => {
			let compactedLayout = compactLayoutHorizontal(groups[targetGroupIndex].apps, this.props.col);
			groups[targetGroupIndex].apps = compactedLayout;
		});

		this.props.updateGroupList(groups);
		this.props.updateShadowCard({});
	};
	/**
	 * 释放sider区中选中的所有卡片CardList到分组中
	 * @param {Object} dragItem 拖拽sider区中选中的所有卡片
	 * @param {Object} dropItem 释放的目标组对象
	**/
	onCardListDropInGroupItem = (dragItem, dropItem) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		const targetGroupIndex = dropItem.index;
		const cardList = dragItem.cardList;
		//拖拽卡片和目标组内卡片合并、去重
		groups[targetGroupIndex].apps = _.concat(groups[targetGroupIndex].apps, cardList);
		groups[targetGroupIndex].apps = _.uniqBy(groups[targetGroupIndex].apps, 'cardid');
		//目标组内重新横向压缩布局
		//todo: 数组偶然的几率出现重排
		let compactedLayout = compactLayoutHorizontal(groups[targetGroupIndex].apps, this.props.col);
		
		groups[targetGroupIndex].apps = compactedLayout;
		this.props.updateGroupList(groups);
	};
	/*
	 * 工作桌面 用户桌面设置 页面
	 * 关于组的操作
	 */
	/**
	 * 移动组的顺序
	 * @param {Number} dragIndex 拖拽的组对象的index值
	 * @param {Number} hoverIndex 拖拽中鼠标悬浮的组对象的index值
	**/
	moveGroupItem = (dragIndex, hoverIndex) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		const dragCard = groups[dragIndex];
		groups.splice(dragIndex, 1);
		groups.splice(hoverIndex, 0, dragCard);
		this.props.updateGroupList(groups);
	};
	/**
	 * 释放分组到分组
	 * @param {Object} dragItem 拖拽的组对象
	 * @param {Object} dropItem 释放的目标组对象
	**/
	onDrop = (dragItem, dropItem) => {
		if (dragItem.type === dropItem.type) {
			return;
		}
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		let card;
		let dropGroupIndex, dragCardIndex, dragCardFromGroupIndex;
		//查找拖拽和目标分组的index值
		for (let i = 0, len = groups.length; i < len; i++) {
			if (groups[i].pk_app_group === dropItem.id) {
				dropGroupIndex = i;
			}
			for (let j = 0, len2 = groups[i].apps.length; j < len2; j++) {
				let apps = groups[i].apps;
				if (apps[j].cardid === dragItem.id) {
					card = apps[j];
					dragCardIndex = j;
					dragCardFromGroupIndex = i;
				}
			}
		}
		groups[dragCardFromGroupIndex].apps.splice(dragCardIndex, 1);
		groups[dropGroupIndex].apps.push(card);
		this.props.updateGroupList(groups);
	};
	/**
	 * 向上移动组
	 * @param {Number} groupIndex 目标分组index
	**/
	upGroupItem = (groupIndex) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		//已第一个组，直接return
		if (groupIndex === 0) {
			return;
		}
		const preGroup = groups[groupIndex - 1];
		groups[groupIndex - 1] = groups[groupIndex];
		groups[groupIndex] = preGroup;
		this.props.updateGroupList(groups);
	};
	/**
	 * 向下移动组
	 * @param {Number} groupIndex 目标分组index
	**/
	downGroupItem = (groupIndex) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		//已最后一个组，直接return
		if (groupIndex === groups.length - 1) {
			return;
		}
		const nextGroup = groups[groupIndex + 1];
		groups[groupIndex + 1] = groups[groupIndex];
		groups[groupIndex] = nextGroup;
		this.props.updateGroupList(groups);
	};
	/**
	 * 向下移动组
	 * @param {String} groupID 目标分组id
	**/
	deleteGroupItem = (groupID) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);

		_.remove(groups, (g) => {
			return g.pk_app_group === groupID;
		});
		this.props.updateGroupList(groups);
	};
	/**
	 * 添加第一个组
	**/
	addFirstGroupItem = () => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		const tmpItem = {
			pk_app_group: 'newGroupItem' + new Date().getTime(),
			groupname: `${this.props.json['DesktopSetting-000002']}`,/* 国际化处理： 分组*/
			type: 'group',
			apps: []
		};
		groups.push(tmpItem);
		this.props.updateGroupList(groups);
		this.props.updateCurrEditID(tmpItem.pk_app_group);
	};
	/**
	 * 添加组
	 * @param {Number} groupIndex 目标分组index
	**/
	addGroupItem = (groupIndex) => {
		let { groups } = this.props;
		let groupNameNation = this.props.json['DesktopSetting-000002']
		groups = _.cloneDeep(groups);
		let insertIndex = groupIndex;
		const tmpItem = {
			pk_app_group: 'newGroupItem' + new Date().getTime(),
			groupname: `${this.props.json['DesktopSetting-000002']}(${utilService.getNewGroupItemNum(groupNameNation, groups)})`,/* 国际化处理： 分组*/
			type: 'group',
			apps: []
		};
		groups.splice(insertIndex + 1, 0, tmpItem);
		//更新分组的redux之后，scroll滚动
		this.asyncUpdateGroupList(groups).then(() => {
			scroller.scrollTo(`a${tmpItem.pk_app_group}`, {
				offset: -139,
				spy: true,
				smooth: true,
				duration: 250,
				containerId: 'nc-workbench-desktop-container'
			});
		});
		this.props.updateCurrEditID(tmpItem.pk_app_group);
	};
	async asyncUpdateGroupList(groups) {
		let user = await this.props.updateGroupList(groups);
		return user;
	}
	/**
	 * 修改分组名称
	 * @param {Number} groupIndex 目标分组index
	 * @param {String} groupname 分组名称
	**/
	changeGroupName = (groupIndex, groupname) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		groups[groupIndex].groupname = groupname;
		this.props.updateGroupList(groups);
		this.props.updateCurrEditID('');
	};
	//当页面加载完成，获得卡片容器宽度
	handleLoad = () => {
		let fn = () => {
			let clientWidth;
			const containerDom = document.querySelector('#card-container');
			if (containerDom) {
				clientWidth = containerDom.clientWidth;
			} else {
				const firstAddButton = document.querySelector('#first-add');
				if (firstAddButton) {
					clientWidth = firstAddButton.clientWidth - 10;
				} else {
					return;
				}
			}
			const defaultCalWidth = this.props.defaultLayout.calWidth;
			const { containerPadding, margin } = this.props.layout;
			let layout = _.cloneDeep(this.props.layout);
			const windowWidth = window.innerWidth - 60 * 2;
			const col = utilService.calColCount(defaultCalWidth, windowWidth, containerPadding, margin);
			const calWidth = utilService.calColWidth(clientWidth, col, containerPadding, margin);

			let { groups } = this.props;
			groups = _.cloneDeep(groups);
			_.forEach(groups, (g) => {
				let compactedLayout = compactLayoutHorizontal(g.apps, col);
				g.apps = compactedLayout;
			});

			layout.calWidth = layout.rowHeight = calWidth;
			layout.col = col;
			layout.containerWidth = clientWidth;
			this.props.updateGroupList(groups);
			this.props.updateLayout(layout);
		}
		DeferFn(fn)
	};
	//卸载组件时，移除resize事件
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleLoad);
	}
	//组件渲染完毕时，添加resize事件
	componentDidMount() {
		window.addEventListener('resize', this.handleLoad);
		//初始化时默认执行新增分组的方法
		setTimeout(() => {
			if (this.props.groups.length === 0) {
				this.addFirstGroupItem();
				document.getElementsByClassName('ant-input')[1].select();//初始化选中input
			}
		},1500);
	}
	// componentDidUpdate(prevProps, prevState) {
	// 	//初始化时默认执行新增分组的方法
	// 	if (this.props.groups.length === 0) {
	// 		setTimeout(() => {
	// 			this.addFirstGroupItem();
	// 			document.getElementsByClassName('ant-input')[1].select();//初始化选中input
	// 		},500);
	// 	}
	// }
	/**
	 * 初始化组
	 * @param {Array} groups 分组数组
	**/
	initGroupItem(groups) {
		let itemDoms = [];
		if (groups.length === 0) {
			itemDoms.push(
				<div key={0} className='first-add' id='first-add'>
					<Button
						className='group-item-add'
						onClick={this.addFirstGroupItem}
						>
						{' '}
						+ {this.props.json['DesktopSetting-000001']}
						{/* /* 国际化处理： 新增分组*/ }
					</Button>
				</div>
			);
		} else {
			itemDoms = groups.map((g, i) => {
				return (
					<GroupItem
						key={g.pk_app_group}
						id={g.pk_app_group}
						type={g.type}
						index={i}
						cards={g.apps}
						length={groups.length}
						groupname={g.groupname}
						moveCardInGroupItem={this.moveCardInGroupItem}
						onDrop={this.onDrop}
						onCardDropInGroupItem={this.onCardDropInGroupItem}
						onCardListDropInGroupItem={this.onCardListDropInGroupItem}
						moveGroupItem={this.moveGroupItem}//移动分组
						upGroupItem={this.upGroupItem}
						downGroupItem={this.downGroupItem}
						deleteGroupItem={this.deleteGroupItem}
						addGroupItem={this.addGroupItem}
						changeGroupName={this.changeGroupName}
						getCardsByGroupIndex={this.getCardsByGroupIndex}
						handleLoad={this.handleLoad}
					/>
				);
			});
		}
		return itemDoms;
	}
	render() {
		const { groups, relateidObj } = this.props;
		return (
			<div className='nc-desktop-setting-content'>
				<MyContentAnchor onCardListDropInGroupItem={this.onCardListDropInGroupItem} />
				<div className='nc-workbench-desktop-container' id='nc-workbench-desktop-container'>
					{this.initGroupItem(groups)}
				</div>
				<MyFooter relateidObj={relateidObj}  unLoadNext={this.props.unLoad}/>
			</div>
		);
	}
}

export default connect(
	(state) => ({
		groups: state.templateDragData.groups,
		shadowCard: state.templateDragData.shadowCard,
		layout: state.templateDragData.layout,
		defaultLayout: state.templateDragData.defaultLayout,
		col: state.templateDragData.layout.col,
		json:state.templateDragData.json
	}),
	{
		updateGroupList,
		updateShadowCard,
		updateCurrEditID,
		updateLayout
	}
)(MyContent);

import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { Icon, Checkbox } from 'antd';
import { connect } from 'react-redux';
import { compactLayoutHorizontal } from './compact.js';
import { updateShadowCard, updateGroupList } from 'Store/test/action';
import * as utilService from './utilService';
import _ from 'lodash';
import background_card from 'Assets/images/background_card.png'
const noteSource = {
	//开始拖拽，设置isShadow属性，shadowCard对象，更新groups
	beginDrag(props, monitor, component) {
		const dragCard = utilService.getCardByGroupIDAndCardID(props.groups, props.groupID, props.id);
		dragCard.isShadow = true;
		props.updateShadowCard(dragCard);
		// setTimeout(function(){
		// 	debugger
		// },1000)
		
		return { id: props.id, type: props.type };
	},
	//结束拖拽，设置isShadow属性，shadowCard对象，更新groups
	endDrag(props, monitor, component) {
		//判断是否正常走了drop事件
		if (!monitor.didDrop()) {
            console.log("endDragendDragendDragendDrag");
			let { groups, groupIndex } = props;
			groups = _.cloneDeep(groups);
			utilService.setPropertyValueForCards(groups, 'isShadow', false);
			props.updateShadowCard({});
			props.updateGroupList(groups);
		}
	}
};
@DragSource('item', noteSource, (connect) => ({
	connectDragSource: connect.dragSource()
}))
//卡片组件类
class Item extends Component {
	constructor(props) {
		super(props);
	}
	//依靠前后props中shadowCard状态（前为空对象，后为有对象）来判断是否为beginDrag状态，来阻止dom刷新
	shouldComponentUpdate(nextProps, nextState) {
		const thisProps = this.props || {},
			thisState = this.state || {};

		if (this.props.isChecked !== nextProps.isChecked) {
			return true;
		}
		//全等判断值为false，使用isEqual判断
		if (!_.isEqual(this.props.layout, nextProps.layout)) {
			return true;
		}
		if (this.props.gridx !== nextProps.gridx || this.props.gridy !== nextProps.gridy) {
			return true;
		}
		if (this.props.isShadow !== nextProps.isShadow) {
			return true;
		}
		return false;
	}
	//删除卡片
	deleteCard = () => {
		let { groups, groupIndex } = this.props;
		groups = _.cloneDeep(groups);
		utilService.removeCardByGroupIndexAndCardID(groups, groupIndex, this.props.id);

		let compactedLayout = compactLayoutHorizontal(groups[groupIndex].apps, this.props.layout.col);
		groups[groupIndex].apps = compactedLayout;
		this.props.updateGroupList(groups);
	};
	//选中卡片
	onCheckboxChange = (e) => {
		let { groups, groupIndex, index } = this.props;
		groups = _.cloneDeep(groups);
		const checked = e.target.checked;
		groups[groupIndex].apps[index].isChecked = checked;
		this.props.updateGroupList(groups);
	};
	render() {
		const {
			connectDragSource,
			name,
			gridx,
			gridy,
			width,
			height,
			isShadow,
			isChecked,
			haspower
		} = this.props;
        
		const { margin, rowHeight, calWidth } = this.props.layout;
		const { x, y } = utilService.calGridItemPosition(gridx, gridy, margin, rowHeight, calWidth);
		const { wPx, hPx } = utilService.calWHtoPx(width, height, margin, rowHeight, calWidth);
		let cardDom;
		//是否为拖拽中的阴影卡片
		if (isShadow) {
			cardDom = (
				<div
					className='card-shadow'
					style={{
						width: wPx,
						height: hPx,
						transform: `translate(${x}px, ${y}px)`
					}}
				/>
			);
		} else {
			const opacity = haspower === false ? 0.6 : 1;
			cardDom = (
				<div
					className='card'
					style={{
						width: wPx,
						height: hPx,
						opacity: opacity,
						transform: `translate(${x}px, ${y}px)`
					}}
				>
					<div style={{ paddingLeft: '10px' }}>{name}</div>
					<div className='card-mid'>
						<img 
							field='logo'
							fieldname={this.props.json['DesktopSetting-000000']}/* 国际化处理： 标识*/
							src={background_card}
							alt='logo'
							width='107'
							height='113'
						/>
					</div>
					<div className='card-footer'>
						<Checkbox checked={isChecked} onChange={this.onCheckboxChange} />
						{/* <Icon type='delete' className='card-delete' onClick={this.deleteCard} /> */}
						<i
							className='iconfont icon-shanchu card-delete'
							onClick={this.deleteCard}
						/>
					</div>
				</div>
			);
		}
		return connectDragSource(cardDom);
	}
}

export default connect(
	(state) => ({
		groups: state.templateDragData.groups,
		// shadowCard: state.templateDragData.shadowCard,
		layout: state.templateDragData.layout,
		json: state.templateDragData.json
	}),
	{ 
		updateShadowCard,
		updateGroupList
	}
)(Item);

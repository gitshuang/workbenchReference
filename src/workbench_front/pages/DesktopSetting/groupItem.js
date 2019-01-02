import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import Card from './card';
import GroupItemHeader from './groupItemHeader';
import _ from 'lodash';
import { Button } from 'antd';
import { updateCurrEditID } from 'Store/test/action';
import * as utilService from './utilService';

const groupItemSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
			type: props.type
		};
	},
	canDrag(props) {
		return props.currEditID === '' ? true : false;
	}
};

const groupItemTarget = {
	hover(props, monitor, component) {
		const dragItem = monitor.getItem();

		if (dragItem.type === 'group') {
			//组hover到组
			const dragIndex = monitor.getItem().index;
			const hoverIndex = props.index;

			if (dragIndex === hoverIndex) {
				return;
			}

			const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

			const clientOffset = monitor.getClientOffset();

			const hoverClientY = clientOffset.y - hoverBoundingRect.top;

			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}

			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}

			props.moveGroupItem(dragIndex, hoverIndex);

			monitor.getItem().index = hoverIndex;
		} else if (dragItem.type === 'card') {
			//卡片到组
			const hoverItem = props;
			// debugger
			const { x, y } = monitor.getClientOffset();
			const groupItemBoundingRect = findDOMNode(component).getBoundingClientRect();
			const groupItemX = groupItemBoundingRect.left;
			const groupItemY = groupItemBoundingRect.top;
			props.moveCardInGroupItem(dragItem, hoverItem, x - groupItemX, y - groupItemY);
		}
	},
	drop(props, monitor, component) {
		const dragItem = monitor.getItem();
		const dropItem = props;
		if (dragItem.type === 'group') {//释放的分组对象
			props.onDrop(dragItem, dropItem);
		} else if (dragItem.type === 'card') {//释放的分组内的卡片
			props.onCardDropInGroupItem(dragItem, dropItem);
		} else if (dragItem.type === 'cardlist') {//释放的Sider区域的卡片
			props.onCardListDropInGroupItem(dragItem, dropItem);
		}
	}
};

//DropTarget用于包装接收拖拽元素的组件，使组件能够放置
@DropTarget('item', groupItemTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver()
}))
//DropSource用于包装你需要拖动的组件，使组件能够被拖拽
@DragSource('item', groupItemSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging()
}))
class GroupItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	componentDidMount() {
		let clientWidth;
		const containerDom = document.querySelector('#card-container');
		if (containerDom) {
			clientWidth = containerDom.clientWidth;
		}
		if (this.props.layout.containerWidth !== clientWidth) {
			this.props.handleLoad();
			// console.log('handle');
		}
	}
	//创建卡片
	createCards(cards, groupID, index) {
		let itemDoms = [];
		_.forEach(cards, (c, i) => {
			itemDoms.push(
				<Card
					dragCardID={-1}
					apptype={c.apptype}
					type={'card'}
					name={c.name}
					id={c.cardid}
					groupID={groupID}
					groupIndex={index}
					index={i}
					gridx={c.gridx}
					gridy={c.gridy}
					width={c.width}
					height={c.height}
					haspower={c.haspower}
					isShadow={c.isShadow}
					isChecked={c.isChecked}
					key={`${groupID}_${c.cardid}`}
				/>
			);
		});
		return itemDoms;
	}
	//向上移动组
	upGroupItem = (index) => {
		this.props.upGroupItem(index);
	};
	//向下移动组
	downGroupItem = (index) => {
		this.props.downGroupItem(index);
	};
	//删除组
	deleteGroupItem = (id) => {
		this.props.deleteGroupItem(id);
	};
	//添加组
	addGroupItem = () => {
		this.props.addGroupItem(this.props.index);
	};
	//改变组名
	changeGroupName = (index, groupname) => {
		this.props.changeGroupName(index, groupname);
	};

	render() {
		
		const {
			isDragging,
			connectDragSource,
			connectDropTarget,
			isOver,
			groupname,
			id,
			index,
			length,
			currEditID,
			defaultLayout,
			layout,
			cards
		} = this.props;
		const containerHeight = utilService.getContainerMaxHeight(cards, layout.rowHeight, layout.margin);
		const opacity = isDragging ? 0 : 1;
		const groupItemClassName = currEditID===id?"group-item edit-group-item":"group-item";
		const groupDrag = currEditID===id ? 'groupDragID' : '';
		return connectDragSource(
			connectDropTarget(
				<div className={groupItemClassName} name={`a${id}`} style={{ opacity: opacity }} id={groupDrag}>
					<div
						className='group-item-container'
						// style={{ background: isOver ? 'rgb(204, 204, 204)' : 'rgba(79,86,98,.1)' }}
					>
						<GroupItemHeader
							currEditID={this.props.currEditID}
							id={this.props.id}
							cards={this.props.cards}
							groupname={this.props.groupname}
							index={this.props.index}
							length={this.props.length}
							changeGroupName = {this.changeGroupName}
							deleteGroupItem = {this.deleteGroupItem}
							downGroupItem = {this.downGroupItem}
							upGroupItem = {this.upGroupItem}
						/>
						<section
							id='card-container'
							style={{
								height:
									containerHeight > defaultLayout.containerHeight
										? containerHeight
										: defaultLayout.containerHeight
							}}
						>
							{this.createCards(cards, id, index)}
						</section>
					</div>

					<div className='group-add'>
						<Button className='group-item-add' onClick={this.addGroupItem}>
							{' '}
							+ {this.props.json['DesktopSetting-000001']}
							{/* /* 国际化处理： 新增分组*/ }
						</Button>
					</div>
				</div>
			)
		);
	}
}

export default connect(
	(state) => ({
		layout: state.templateDragData.layout,
		defaultLayout: state.templateDragData.defaultLayout,
		currEditID: state.templateDragData.currEditID,
		json: state.templateDragData.json
	}),
	{
		updateCurrEditID
	}
)(GroupItem);

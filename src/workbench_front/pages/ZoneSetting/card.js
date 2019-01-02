import { DragSource, DropTarget } from 'react-dnd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
//卡片属性组件类
const cardSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index
		};
	},
	isDragging(props, monitor) {
		// If your component gets unmounted while dragged
		// (like a card in Kanban board dragged between lists)
		// you can implement something like this to keep its
		// appearance dragged:
		return monitor.getItem().id === props.id;
	}
};

const cardTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return;
		}

		// Time to actually perform the action
		props.moveCard(dragIndex, hoverIndex);

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex;
	}
};

@DropTarget('card', cardTarget, (connect) => ({
	connectDropTarget: connect.dropTarget()
}))
@DragSource('card', cardSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging()
}))
class MyCard extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	//删除该卡片
	deleteCard = (e) => {
		e.stopPropagation();
		this.props.deleteCard(this.props.index);
	};
	//选择该卡片
	selectThisCard = () => {
		this.props.selectThisCard(this.props.index);
	};
	//获得卡片样式的className名
	getCardClassName = () => {
		const { selectCard, required, id, areaid } = this.props;
		let result = '';
		if (required) {
			result = ' required-card';
		}
		if (selectCard.pk_query_property === id && selectCard.areaid === areaid) {
			result = `select-card${result}`;
		} else {
			result = `normal-card${result}`;
		}
		return result;
	};

	render() {
		const {
			index,
			name,
			id,
			key,
			selectCard,
			areaid,
			visible,
			color,
			shouldHideGray,
			isDragging,
			connectDragSource,
			connectDropTarget
		} = this.props;
		const opacity = isDragging ? 0 : visible ? 1 : 0.5;
		const myClassName = this.getCardClassName();
		const myShowName = _.isEmpty(name) ? String.fromCharCode(160) : name;
		if(shouldHideGray===true && visible===false){
			return null;
		}
		return connectDragSource(
			connectDropTarget(
				<li className='property-item' style={{ opacity: opacity }} onClick={this.selectThisCard}>
					<div style={{ color: color }} className={myClassName} title={myShowName}>
						{myShowName}
						<span className='delete-card' onClick={this.deleteCard}>
							x
						</span>
					</div>
				</li>
			)
		);
	}
}
export default connect(
	(state) => ({
		selectCard: state.zoneSettingData.selectCard
	}),
	{}
)(MyCard);

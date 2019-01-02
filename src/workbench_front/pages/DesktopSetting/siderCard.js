import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Checkbox } from 'antd';
import { connect } from 'react-redux';
import { updateGroupList } from 'Store/test/action';
import { hasCardContainInGroups } from './utilService';
const noteSource = {
	beginDrag(props, monitor, component) {
		let cardList = [];
		let { appGroupArr } = props;
		//将所有选中的Sider区域卡片，进行初始化
		_.forEach(appGroupArr, (a,groupIndex) => {
			_.forEach(a.children, (c,childIndex) => {
				//被勾选的或者当前拖拽的卡片，压栈进数组
				if (c.checked || c.value === props.id) {
					cardList.push({
						cardid: c.value,
						width: c.width,
						height: c.height,
						name: c.label,
						isShadow: false,
						isChecked: false,
						//注：拖拽时卡片的坐标
						gridx: 666 + groupIndex*100 + childIndex,
						gridy: 999
					});
				}
			});
		});
		return { type: 'cardlist', cardList: cardList };
	},
	endDrag(props, monitor, component) {
		//Drop成功
		if (monitor.didDrop()) {
			let { appGroupArr } = props;
			appGroupArr = _.cloneDeep(appGroupArr);
			//endDrag，重置Sider区域中的卡片
			_.forEach(appGroupArr, (a) => {
				_.forEach(a.children, (c) => {
					if (c.checked) {
						c.checked = false;
					}
				});
				a.checkedAll = false;
				a.indeterminate = false;
			});
			props.updateAppGroupArr(appGroupArr);
		}
	}
};

function collectSource(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging()
	};
}

class Item extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		// Use empty image as a drag preview so browsers don't draw it
		// and we can draw whatever we want on the custom drag layer instead.
		this.props.connectDragPreview(getEmptyImage(), {
			// IE fallback: specify that we'd rather screenshot the node
			// when it already knows it's being dragged so we can hide it with CSS.
			captureDraggingState: true
		});
	}
	//SCU检测是否选中，是否在分组内存在
	shouldComponentUpdate(nextProps, nextState) {
		const thisProps = this.props || {},
			thisState = this.state || {};
		if (this.props.checked !== nextProps.checked) {
			return true;
		}
		if (hasCardContainInGroups(this.props.groups, this.props.id)!==hasCardContainInGroups(nextProps.groups, this.props.id)) {
			return true;
		}
		return false;
	}
	//改变SiderCard的选中状态
	onChangeChecked = (e) => {
		const checked = e.target.checked;
		const { index, parentIndex } = this.props;
		this.props.onChangeChecked(checked, parentIndex, index);
	};
	clickSiderCard = () => {
		const { index, parentIndex, checked } = this.props;
		this.props.onChangeChecked(!checked, parentIndex, index);
	};
	render() {
		const { connectDragSource, groups, id, index, name, checked, parentIndex } = this.props;
		//显示已添加卡片的小图标
		const isContainInGroups = hasCardContainInGroups(groups, id)
		// ? <i
		// 	title="已添加卡片"
		// 	className="iconfont icon-peizhi_yixuan"
		// 	style={ {color: 'rgb(0, 122, 206)', position: 'absolute', top: '21px', right: '-3px' } }
	      
		//   />
		//  : '';
		return connectDragSource(
			<div>
				<div 
					className='list-item-content' 
					onClick={this.clickSiderCard}
					style={
						checked
							? {
								border: '1px dashed #d4d4d4'
							}
							: null
					}
				>
					{
					isContainInGroups
					?
					<div className='title isAddColor'>
						<span className='title-name'>{name}</span>
					</div>
					:
					<div className='title'>
						<span className='title-name'>{name}</span>
					</div>
					}
					{checked ? (
						<i
							title={this.props.json['DesktopSetting-000039']}/* 国际化处理： 卡片已选中*/
							className="iconfont icon-peizhi_tianjia iconlocation"
							style={ {color: 'rgb(0, 122, 206)'} }
						/>
					) : (
						<i
							title={this.props.json['DesktopSetting-000040']}/* 国际化处理： 卡片未选中*/
							className="iconfont icon-peizhi_tianjia iconlocation unSelect"
						/>
					)}
					{isContainInGroups}
				</div>
			</div>
		);
	}
}

const dragDropItem = DragSource('item', noteSource, collectSource)(Item);

export default connect(
	(state) => ({
		groups: state.templateDragData.groups,
		json: state.templateDragData.json
	}),
	{
		updateGroupList
	}
)(dragDropItem);

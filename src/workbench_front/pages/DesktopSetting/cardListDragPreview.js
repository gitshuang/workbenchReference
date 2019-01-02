import React, { Component } from 'react';
import background_card from 'Assets/images/background_card.png'
//拖拽预览组件类
export default class CardListDragPreview extends Component {
	constructor(props) {
		super(props);
	}
	//当拖拽的siderCard的数量变化时，重新渲染
	shouldComponentUpdate(nextProps, nextState) {
		const thisProps = this.props || {},
			thisState = this.state || {};
		if (this.props.cardListLength !== nextProps.cardListLength) {
			return true;
		}
		return false;
	}
	render() {
		const { cardListLength } = this.props;
		let divDom = [];
		for (let index = 0; index < cardListLength; index++) {
			//第一个显示layer的dom，需要显示图片和数量红色气泡
			if (index === cardListLength - 1) {
				const myIndex = index >= 3 ? 3 : index;
				divDom.push(
					<div
						key={index}
						className='layer-card'
						style={{ left: `${myIndex * 5}px`, top: `${myIndex * 5}px` }}
					>
						<span className='layer-card-span'>＋{cardListLength}</span>
						<img 
							src={background_card}
							alt='logo'
							width='107'
							height='113'
						/>
					</div>
				);
			} else if (index < 3) {//layer的dom最多显示四个
				divDom.push(
					<div key={index} className='layer-card' style={{ left: `${index * 5}px`, top: `${index * 5}px` }} />
				);
			}
		}
		return <div className='desk-setting-layer-card-list'>{divDom}</div>;
	}
}

import React, { Component } from 'react';
import { Link } from 'react-scroll';
import { connect } from 'react-redux';
import './index.less';

class TabsLink extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			nextPage: false,
			nowPosition: 0,//当前位置
			times: 1,//可点击下一页的次数
			nextPageIcon: false,//下一页是否可点击状态颜色
			previousPageIcon: false,//前一页是否可点击状态颜色
			isVisiblePage: false,//是否显示分页
		}
	}
	//创建li
	createTabsLink = () => {
		return this.props.groups.map((item, index) => {
			let { pk_app_group, groupname } = item;
			// console.log('偏移量', this.state.nowPosition);
			// console.log('上一页点击状态', this.state.nextPage);
			return (
				<li
					key={pk_app_group}
					style={
						this.state.nextPage && index == '0'
						? {marginLeft: `-${this.state.nowPosition}%`}
						: {}
					}
					>
					<Link activeClass ='active' to={pk_app_group} offset={-40} spy={true} smooth={true} duration={500} containerId="ncWorkbenchHomePage">
						{groupname}
						<span></span>
					</Link>
				</li>
			);
		});
	};
	//click前一步
	previousPageGroup = () => {
		let totalWidth = this.refs.refTabs.offsetWidth;//显示宽度
		let displayWidth = this.refs.refUl.offsetWidth;//ul总宽度
		let numPage = displayWidth/totalWidth;
		let clickNum = Math.ceil(numPage);
		let liMarginLeftVal = ((totalWidth - 40)/displayWidth)*100;//计算偏移量
		if(this.state.nowPosition <  1) {
			this.setState({
				times: 1
			})
			return;
		}
		//前一页是否允许点击状态
		if (this.state.times == 1) {
			this.setState({
				previousPageIcon: false
			})
			return;
		}
		this.setState({
			times: this.state.times - 1,
			nowPosition: (this.state.nowPosition - liMarginLeftVal) < 0.01 ? 0 : (this.state.nowPosition - liMarginLeftVal),
			//前一页最后的状态必须用这个判断
			nextPageIcon: true,
		})
	}
	//click下一步
	nextPageGroup = () => {
		let totalWidth = this.refs.refTabs.offsetWidth;
		let displayWidth = this.refs.refUl.offsetWidth;
		let numPage = displayWidth/totalWidth;
		//不满足分页条件返回
		if (numPage < 1.01) {
			return;
		} else {
			//偏移量次数取整
			let clickNum = Math.ceil(numPage);
			if (this.state.times < clickNum) {
				this.setState({
					times: this.state.times + 1
				})
			}else{
				return;
			}
			if (clickNum - this.state.times <= 1) {
				this.setState({
					nextPageIcon: false
				})
			}
		}
		//计算翻页的偏移量
		let liMarginLeftVal = ((totalWidth - 40)/displayWidth)*100;
		this.setState({
			nextPage: true,
			nowPosition: this.state.nowPosition + liMarginLeftVal,
			previousPageIcon: true
		});
	}
	//监听屏幕窗口大小的变化
	screenChange = () => {
		let totalWidth = this.refs.refTabs.offsetWidth;
		let displayWidth = this.refs.refUl.offsetWidth;
		let numPage = displayWidth/totalWidth;
		if (numPage > 1) {
			this.setState({
				nextPageIcon: true,
				isVisiblePage: true//是否显示分页
			})
		} else {
			this.setState({
				isVisiblePage: false//不显示分页
			})
		}
	}
	//dom渲染后用来监测页面分页状态的显示
	componentDidMount () {
		window.addEventListener('resize', this.screenChange);
		//延时加载更改状态
		setTimeout(() => {
			let totalWidth = this.refs.refTabs.offsetWidth;
			let displayWidth = this.refs.refUl.offsetWidth;
			let numPage = displayWidth/totalWidth;
			// console.log('numPage', numPage);
			if (numPage > 1) {
				this.setState({
					nextPageIcon: true,
					isVisiblePage: true//是否显示分页
				})
			} else {
				this.setState({
					isVisiblePage: false//不显示分页
				})
			}
		}, 3500)
		
	}
	componentWillUnmount () {
		window.removeEventListener("resize", this.screenChange);
	}
	render() {
		return  <div className='tabs-layout' ref='refTabs'>
					<div className='tabs-page'>
						<ul 
							ref='refUl'
							className={
								this.state.nextPage
								? 'n-tabs '
								: 'n-tabs'
							}
						>
							{this.createTabsLink()}
						</ul>
					</div>
					<div className='tabs-icon'>
						<span onClick={this.previousPageGroup}>
							<i
								style={
									this.state.isVisiblePage
									? {visibility: 'visible'}
									: {visibility: 'hidden'}									
								}
								className={
									this.state.nowPosition
									? 'iconfont icon-jiantouzuo'
									: 'iconfont icon-jiantouzuo iconfontColor'
								}
							></i>
						</span>
						<span onClick={this.nextPageGroup}>
							<i
								style={
									this.state.isVisiblePage
									? {visibility: 'visible'}
									: {visibility: 'hidden'}									
								}
								className={
									this.state.nextPageIcon
									? 'iconfont icon-jiantouyou'
									: 'iconfont icon-jiantouyou iconfontColor'
								}
							></i>
						</span>
					</div>
				</div>
	}
}
export default connect(
		(state) => ({
			groups: state.homeData.groups
		}),
		{ }
	)(TabsLink)

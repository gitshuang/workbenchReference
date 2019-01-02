import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Input, Checkbox, Popconfirm, Tooltip } from 'antd';
import { updateCurrEditID } from 'Store/test/action';
import Notice from 'Components/Notice';
// const defaultNormalPopTitle = this.props.json['DesktopSetting-000016'];/* 国际化处理： 请输入分组名称，回车确定*/
// const defaultErrorPoptitle = this.props.json['DesktopSetting-000017']/* 国际化处理： 分组名不能为空*/
const Search = Input.Search;
class GroupItemHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
            groupName: props.groupname,
			popTitle: this.props.json['DesktopSetting-000016'],/* 国际化处理： 请输入分组名称，回车确定*/
			inputValue: props.groupname,
		};
    }
    componentDidMount() {
        if(this.props.currEditID === this.props.id){
            this.editGroupItemName()
        }
		
	}
	//向上移动组
	upGroupItem = () => {
		this.props.upGroupItem(this.props.index);
	};
	//向下移动组
	downGroupItem = () => {
		this.props.downGroupItem(this.props.index);
	};
	//删除组
	deleteGroupItem = () => {
		this.props.deleteGroupItem(this.props.id);
	};
	//获得组名
	getGroupName = (e) => {
		let _groupName = e.target.value;
		// console.log('_groupName', _groupName.length);
		if (_groupName.length > 50) {
			_groupName.substring(0,50);
			_groupName = _groupName.substring(0,50);//截取字符串前五十位
			this.refs.editInputDom.blur();//当input输入框长度大于五十的时候使input失去焦点
			Notice({
				status: 'typeError',
				msg: this.props.json['DesktopSetting-000041']/* 国际化处理： 最多只能输入五十个字符*/
			});
		}
		if (_groupName === '') {
			this.setState({ popTitle: this.props.json['DesktopSetting-000017']/* 国际化处理： 分组名不能为空*/ });
		}else{
            this.setState({ popTitle: this.props.json['DesktopSetting-000016']/* 国际化处理： 请输入分组名称，回车确定*/ });
		}
		// console.log('50', _groupName);
        this.setState({ 
			groupName: _groupName,
			inputValue: _groupName
		 });
	};
	//获取鼠标光标
	getBlurPosition = (e) => {
		//拖拽组件react-dnd在页面点击时修改draggable属性为false解决IE鼠标点击问题
		document.getElementById('groupDragID').setAttribute('draggable', false);
	}

	//组名进入编辑状态
	editGroupItemName = () => {
		this.asyncUpdateCurrEditID(this.props.id).then(() => {
			this.refs.editInputDom.focus();
			// dom节点调用
			if (this.refs.editInputDom && this.refs.editInputDom.input) {
				this.refs.editInputDom.input.select();
			}
		});
	};
	async asyncUpdateCurrEditID(id) {
		let user = await this.props.updateCurrEditID(id);;
		return user;
	}
	//改变组名
	changeGroupName = () => {
		let index = this.props.index;
		let groupname = this.state.groupName;
		if (groupname === '') {
            this.setState({ popTitle: this.props.json['DesktopSetting-000017']/* 国际化处理： 分组名不能为空*/ });
		} else {
            this.setState({ popTitle: this.props.json['DesktopSetting-000016']/* 国际化处理： 请输入分组名称，回车确定*/ });
			this.props.changeGroupName(index, groupname);
		}
	};
	//取消编辑组名
	cancelGroupName = () => {
		this.props.updateCurrEditID('');
    };
	
	shouldComponentUpdate(nextProps, nextState) {
		const thisProps = this.props || {},
			thisState = this.state || {};
		if (this.props.groupname !== nextProps.groupname) {
			return true;
		}
		if (this.props.currEditID !== nextProps.currEditID) {
			return true;
		}
		if (this.props.index !== nextProps.index) {
			return true;
		}
		if (this.state.popTitle !== nextState.popTitle) {
			return true;
		}
		if (this.props.length !== nextProps.length) {
			return true;
		}
		if (this.props.cards !== nextProps.cards) {
			return true;
		}
		if (this.state.inputValue !== nextState.inputValue) {
			return true;
		}
		return false;
	}

	render() {
		const { groupname, id, index, length, currEditID } = this.props;
		let { inputValue } = this.state;
		const isExistCardInGroups = this.props.cards.length > 0;
		let groupItemTitle;
		if (currEditID === id) {
			groupItemTitle = (
				<div className='group-item-title-container-no-edit'>
				 	<div className='title-left' ref='titleLeft'>
						<Tooltip 
							trigger={[ 'hover' ]} 
							autoAdjustOverflow={false}//气泡被遮挡住自动调整位置
							getPopupContainer={()=>{return this.refs.titleLeft}} 
							title={this.state.popTitle} 
							placement='bottomLeft'
							>
							<Input
								id='groupNameID'
								ref='editInputDom'
								size='small'
								placeholder={this.props.json['DesktopSetting-000018']}/* 国际化处理： 分组名称，回车确定*/
								defaultValue={groupname}
								onPressEnter={this.changeGroupName}
								onChange={this.getGroupName}
								// maxlength='50'
								value={inputValue}
								onClick={this.getBlurPosition}
								draggable={false}
							/>
						</Tooltip>

						<Icon
							type='check-square-o'
							className='group-item-icon'
							title={this.props.json['DesktopSetting-000015']}/* 国际化处理： 确定*/
							onClick={this.changeGroupName}
						/>
						<Icon
							type='close-square-o'
							className='group-item-icon'
							title={this.props.json['DesktopSetting-000009']}/* 国际化处理： 取消*/
							onClick={this.cancelGroupName}
						/>
					</div>
				</div>
			);
		} else {
			groupItemTitle = (
				<div className='group-item-title-container-no-edit'>
					<div className='title-left'>
						{/* <Checkbox checked={}></Checkbox> */}
						<span className='group-item-title' onClick={this.editGroupItemName}>
							{groupname}
						</span>
						<div className='group-item-title-edit'>
							{/* <Icon
								type='edit'
								title='分组重命名'
								className='group-item-icon'
								onClick={this.editGroupItemName}
							/> */}
							<i
								title={this.props.json['DesktopSetting-000019']}/* 国际化处理： 分组重命名*/
								className='iconfont icon-bianji'
								onClick={this.editGroupItemName}
								style={ {fontSize: '19px'} }
							/>
						</div>
					</div>
					<div className='title-right' >
						<div className={index === 0 ? 'group-item-title-not-edit' : 'group-item-title-edit'}>
							<i
								title={this.props.json['DesktopSetting-000020']}/* 国际化处理： 分组上移*/
								className="iconfont icon-peizhi_up"
								onClick={this.upGroupItem}
							/>
						</div>
						<div className={index === length - 1 ? 'group-item-title-not-edit' : 'group-item-title-edit'}>
							<i
								title={this.props.json['DesktopSetting-000021']}/* 国际化处理： 分组下移*/
								className="iconfont icon-peizhi_down"
								onClick={this.downGroupItem}
							/>
						</div>
						<div className='group-item-title-edit'>
						    {
								isExistCardInGroups 
								?
								<Popconfirm
									title={this.props.json['DesktopSetting-000022']}/* 国际化处理： 确定删除该分组？*/
									onConfirm={this.deleteGroupItem}
									placement='topRight'
									okText={this.props.json['DesktopSetting-000015']}/* 国际化处理： 确定*/
									cancelText={this.props.json['DesktopSetting-000009']}/* 国际化处理： 取消*/
								>
									{/* <Icon type='delete'  title='分组删除' className='group-item-icon' /> */}
									<i
										title={this.props.json['DesktopSetting-000023']}/* 国际化处理： 分组删除*/
										className="iconfont icon-shanchu"
									/>
								</Popconfirm>
								:
								// <Icon 
								// 	type='delete'  
								// 	title='分组删除' 
								// 	className='group-item-icon'
								// 	onClick={this.deleteGroupItem}
								// />
								<i
									title={this.props.json['DesktopSetting-000023']}/* 国际化处理： 分组删除*/
									className="iconfont icon-shanchu"
									onClick={this.deleteGroupItem}
								/>
							}
						</div>
					</div>
				</div>
			);
		}

		return groupItemTitle;
	}
}

export default connect(
	(state) => ({
		currEditID: state.templateDragData.currEditID,
		json: state.templateDragData.json
	}),
	{
		updateCurrEditID
	}
)(GroupItemHeader);

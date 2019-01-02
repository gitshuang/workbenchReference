import { high, base } from 'nc-lightapp-front';
import {langCheck} from "Pub/js/utils";
const { NCRadio } = base;
const { Refer } = high;
const ReferWithUnit = high.Refer.ReferWithUnit;

class Ref extends ReferWithUnit {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state, // 继承state
            radioValue: 'pk_usergroup', // 自定义扩展state
            group_pk: 'firstGroup',
            currentReffer: []
        };
    }
    // renderPopoverHeaderExtend = () => {
    // 	const { unitProps, isShowUnit, unitCondition, defaultUnitValue } = this.props;
    // 	unitProps.queryCondition = unitCondition;
    // 	return (
    // 		isShowUnit && (
    // 			<div style={{ width: '200px', marginLeft: '20px' }}>
    // 				<Refer
    // 					{...unitProps}
    // 					value={this.state.unit}
    // 					onChange={(v) => {
    // 						this.setState(
    // 							{
    // 								unit: v
    // 							},
    // 							() => {
    // 								this.refresh(false);
    // 							}
    // 						);
    // 					}}
    // 					popWindowClassName={'refer-unit-pop-window'}
    // 				/>
    // 			</div>
    // 		)
    // 	);
    // };

    // renderPopoverHeader = () => {
    //     return <div>用户参照</div>;
    // };

    // renderPopoverSearchArea = () => {
    //     return (
    // 		<div><Refer
    // 		refName={'集团'}
    // 		refCode={'pk_group'}
    // 		queryTreeUrl={'/nccloud/riart/ref/groupRefTreeAction.do'}
    // 		refType={'tree'}
    // 		pageSize={50}
    // 		isCacheable = {true}
    // 		placeholder="集团"
    // 		refType="tree"
    // 		onChange={this.handleGroupChange.bind(this)}
    // 		value = {this.state.currentReffer}
    // 		// {...config}

    // 		/>
    // 		</div>
    // 	);
    // };

    getParam = (param = {}) => {
        let { queryCondition, pageSize, refType } = this.props,
            { keyword = '', pid = '', pageInfo = {} } = param;
        pageInfo = {
            pageSize: pageInfo.pageSize || pageSize,
            pageIndex: pageInfo.pageIndex || (refType === 'tree' ? -1 : 0)
        };
        let _param = {
            pid, // 对应的树节点
            keyword,
            queryCondition: queryCondition
                ? typeof queryCondition === 'function'
                  ? queryCondition()
                  : typeof queryCondition === 'object' ? queryCondition : {}
                : {},
            pageInfo
        };
        _param.queryCondition.queryUserType = this.state.radioValue;
        _param.queryCondition.queryUserCode = pid;
        _param.queryCondition.group_pk = this.state.unit.refpk;
        return _param;
    };

    handleGroupChange = (value) => {
        this.setState(
            {
                group_pk: value.refpk,
                expandedKeys: [],
                currentReffer: value
            },
            () => {
                this.getTreeData();
            }
        );
    };

    handleRadioChange = (value) => {
        this.props.rRadioOnChange(value);
        this.setState(
            {
                treeSearchVal: '',
                radioValue: value,
                unitPks: this.state.unit.refpk
            },
            () => {
                this.getTreeData();
            }
        );
    };

    getTreeData = () => {
        const { queryTreeUrl, isCacheable, rootNode } = this.props;
        let param = this.getParam({
                pid: '',
                pageInfo: {
                    pageSize: 10,
                    pageIndex: -1
                },
                queryCondition: {
                    queryUserType: this.state.radioValue,
                    group_pk: this.state.unit.refpk
                }
            }),
            cacheData = this.hasCache(queryTreeUrl, param);

        this.state.tableData = [
            {
                rows: [],
                page: {
                    pageIndex: 0,
                    pageSize: this.props.pageSize,
                    totalPage: 1
                }
            }
        ];
        if (isCacheable && cacheData) {
            this.setTreeData('treeData', rootNode, cacheData);
        } else {
            this.loadTreeData(param).then((data) => {
                this.setTreeData('treeData', rootNode, data);
            });
        }
        this.setState({
            tableData: this.state.tableData
        });
    };

    renderPopoverLeftHeader = () => {
        return (
            <div id='radioGroup' style={{ 'margin-bottom': '5px' }}>
                <NCRadio.NCRadioGroup
                    name='role'
                    radioValue={this.state.radioValue}
                    selectedValue={this.state.radioValue}
                    onChange={this.handleRadioChange.bind(this)}
                >
                    <NCRadio value='pk_usergroup'>{langCheck('0000PUB-000069')}</NCRadio>
                    {/* 国际化处理： 用户组*/}
                    <NCRadio value='pk_dept'>{langCheck('0000PUB-000070')}</NCRadio>
                    {/* 国际化处理： 部门*/}
                    <NCRadio value='pk_org'>{langCheck('0000PUB-000067')}</NCRadio>
                    {/* 国际化处理： 所属组织*/}
                </NCRadio.NCRadioGroup>
            </div>
        );
    };
}
export default Ref;

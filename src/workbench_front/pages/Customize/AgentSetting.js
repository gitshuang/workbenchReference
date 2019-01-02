import React, { Component } from "react";
import { Button,Icon } from "antd";
import { connect } from "react-redux";
import {arrayUnique,deepClone,langCheck} from "Pub/js/utils.js";
import ComLayout from "./ComLayout";
// 单据类型参照
import Billtype from "Components/Refers/billtype";
// 默认添加代理人参照
import UserRefer from "Components/Refers/userRefer";
import SortableList from "./SortableList"
import Ajax from "Pub/js/ajax";
import Notice from "Components/Notice";
import { Popconfirm } from "antd";
class AgentSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitDate:[
              {
                itemTypeInfo:{refname:"ALL"},
                agentInfo:[]  
              } 
            ],
            //当前单据类型名称
              curItemType:"ALL",
            // 应用按钮是否可用   true表示不可点
            disabled: true,
            //点应用时页面修改过的单据信息 
            realSubmit:[]
        }
        this.historyData = deepClone(this.state.submitDate);

    }

    handdleRefChange = (value, type) => {
        let { json } = this.props;
        let curState = deepClone(this.state);
        let obj = {};
        if(type == "itemTypeInfo"){
            let curValue= curState["submitDate"].filter(function(item){
                return item.itemTypeInfo.refname == value.refname; 
           })
            if(curValue.length == 0){
                obj["submitDate"] = curState["submitDate"].concat({
                    itemTypeInfo:{refname:value.refname},
                    agentInfo:[]  
                });
                 
                obj["curItemType"] = value.refname;
            }else{
                Notice({ status: "warning", msg: langCheck('Customize-000000', 'pages', json) });/* 国际化处理： 该条单据类型已经存在！*/
            }
        }else{
            let curSubmitDate = curState.submitDate;
            curSubmitDate.map((items,index)=>{
                if(items.itemTypeInfo.refname == this.state.curItemType){
                    let agentValue = [];
                    for (let s of value){
                        let agentValueItem = {
                            refcode:s.refcode, //代理人id
                            refpk:s.refpk, //代理人主键名
                            refname:s.refname, //代理人姓名
                        }
                        agentValue.push(agentValueItem);
                    }
                    items["agentInfo"] = items["agentInfo"].concat(agentValue);
                    if(JSON.stringify(items["agentInfo"]) !== JSON.stringify(arrayUnique(items["agentInfo"],"refcode"))){
                        Notice({ status: "warning", msg: langCheck('Customize-000001', 'pages', json) });/* 国际化处理： 该条代理人信息已经存在！*/
                        items["agentInfo"] = arrayUnique(items["agentInfo"],"refcode");
                    }
                }
            })
            obj["submitDate"] = curSubmitDate;
        }
        this.setState({ ...obj }, () => this.DataCheck());
    };
    
    // 数据检查
    DataCheck = (delflag) => {
        let flag = (JSON.stringify(this.historyData) == JSON.stringify(this.state.submitDate));
        let realSub = deepClone(this.state.realSubmit);
        if(!flag && (!delflag)){
            realSub = realSub.concat(this.state.curItemType);
        }
        this.setState({
            disabled: flag,
            realSubmit:realSub
        });
    };
    deleteEvent = (value,type) => {
        let curState = deepClone(this.state);
        let obj = {};
        if(type == "itemTypeInfo"){
            obj["submitDate"] = curState["submitDate"].filter(function(curStateSub,index){
                if(value.itemTypeInfo.refname == curStateSub.itemTypeInfo.refname){
                    console.log(curState["submitDate"][index-1]["itemTypeInfo"]["refname"]);
                    obj["curItemType"] = curState["submitDate"][index-1]["itemTypeInfo"]["refname"];
                    obj["realSubmit"] = curState["realSubmit"];
                    obj["realSubmit"] = obj["realSubmit"].concat(curStateSub.itemTypeInfo.refname);
                    return false;
                }else{
                    return true;
                }
            });
        }else{
            let curSubmitDate = curState.submitDate;
            curSubmitDate.map((items,index)=>{
                if(items.itemTypeInfo.refname == this.state.curItemType){
                    items["agentInfo"] = items["agentInfo"].filter(function(item){
                        if(value.refcode == item.refcode){
                            return false;
                        }else{
                            return true;
                        }
                    });
                }
            })
            obj["submitDate"] = curSubmitDate;
        }
        this.setState({ ...obj }, () => {type == "itemTypeInfo"?this.DataCheck(true):this.DataCheck()});
    }
    toggleEvent = (value) =>{
        this.setState({curItemType:value});
    }
    //保存数据
    getAllData = () => {
        let realSubmit = Array.from(new Set(this.state.realSubmit)) // 数组去重
        let reqData =[];
        let { json } = this.props;
        for(let m = 0;m<realSubmit.length;m++){
            let flag = true;
            for (let items of this.state.submitDate){
                if(realSubmit[m] == items.itemTypeInfo.refname){
                    let reqDataItem;
                    let workflowagentVOs = [];  //代理人信息
                    if(items["agentInfo"]){
                        for (let [index,item] of items["agentInfo"].entries()){
                            let agentInfo = {
                                'pk_cuserid':this.props.userId,  //被代理人id
                                'userCode':item.refcode, //代理人id
                                'pk_workflow':item.refpk, //代理人主键名
                                'userName':item.refname, //代理人姓名
                                'billtypes':items.itemTypeInfo.refname,   //单据类型或单据类型名称（可以有多个）
                                'sysindex':index+1 //优先级
                            }
                            workflowagentVOs.push(agentInfo);
                        }
                    }
                    reqDataItem = {
                        'billname':items.itemTypeInfo.refname,
                        'workflowagentVOs':workflowagentVOs
                    };
                    reqData.push(reqDataItem);
                    flag = false;
                    break;
                }
            }
            if(flag){
                reqData.push({
                    'billname':realSubmit[m],
                    'workflowagentVOs':[]
                });
            }
        }
        Ajax({
            url: `/nccloud/platform/agent/saveagentinfo.do`,
            data: {userAgentsVOs:reqData},
            info: {
                name: langCheck('Customize-000002', 'pages', json),/* 国际化处理： 个性化-代理人设置*/
                action: langCheck('Customize-000003', 'pages', json)/* 国际化处理： 保存*/
            },
            success: ({ data: { data } }) => {
                if (data) {
                    Notice({
                        status: "success"
                    });
                    this.setState({disabled: true });
                    
                }
            }
        });
    }
    getRealDate(arr,flag){
        let newArr =[{
            itemTypeInfo:{refname:"ALL"},
            agentInfo:[]  
          }];  //[{itemTypeInfo:"",agentInfo:[]}]
        for(let i=0;i<arr.length;i++){
            let filterArr = newArr.filter(function(item){
                return item.itemTypeInfo.refname == arr[i][flag];
            })
            if(filterArr.length>0){
                let agentInfo = {
                    refcode:arr[i].userCode, //代理人id
                    refpk:arr[i].pk_workflow, //代理人主键名
                    refname:arr[i].userName, //代理人姓名
                }
                filterArr[0]["agentInfo"].push(agentInfo);
            }else{
                let itemDate = {
                    itemTypeInfo:{refname:arr[i].billtypes},
                    agentInfo:[
                        {
                            refcode:arr[i].userCode, //代理人id
                            refpk:arr[i].pk_workflow, //代理人主键名
                            refname:arr[i].userName, //代理人姓名
                        }
                    ]
                }
                newArr.push(itemDate);
            }
            
        }
            return newArr;
    }
    componentDidMount(){
        let { json } = this.props;
        Ajax({
            url: `/nccloud/platform/agent/queryagentsofuser.do`,
            info: {
                name: langCheck('Customize-000004', 'pages', json),/* 国际化处理： 个性化-代理人*/
                action: langCheck('Customize-000005', 'pages', json)/* 国际化处理： 查询*/
            },
            success: ({ data: { data } }) => {
                //得到的数据格式：[{itemTypeInfo:"",agentInfo:[]}],
                if(data.length>0){
                    let newDate = this.getRealDate(data,"billtypes");
                    console.log(data);
                    this.setState({
                        submitDate:newDate,
                        curItemType:newDate[0].itemTypeInfo.refname
                    },()=>{this.historyData = deepClone(this.state.submitDate)})
                }
            }
        });
    }
    render() {
        let {
            disabled
        } = this.state;
        let { json } =this.props;
        let curAgentInfo = [];
        for (let items of this.state.submitDate){
            if(items.itemTypeInfo.refname == this.state.curItemType){
                curAgentInfo = items.agentInfo;
            }
        }
        return (
            <ComLayout title={this.props.title}>
                <div className="agentSetting workbench-auto-scroll">
                    <div className="agent-container">
                        <div className="agent-container-left">
                            <div className="agent-container-top">
                                <div className="agent-container-div">{langCheck('Customize-000011', 'pages', json)/* 国际化处理： 单据类型*/}</div>
                                <div className="agent-container-div">
                                    <Billtype
                                        value=""
                                        placeholder={langCheck('Customize-000006', 'pages', json)}/* 国际化处理： 添加单据类型*/
                                        onChange={value => {
                                            this.handdleRefChange(value, "itemTypeInfo");
                                        }}
                                        clickContainer={
                                            <Button className="agent-container-button" type="danger">
                                            <span className="agent-container-circle">+</span>{langCheck('Customize-000012', 'pages', json)/* 国际化处理： 新增*/}
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>
                            <div onClick={()=>{this.toggleEvent("ALL")}} className={this.state.curItemType == "ALL"?"agent-container-All activeList":"agent-container-All"}>ALL</div>
                            <div className="agent-container-itemType">
                                {
                                    this.state.submitDate.map((items,index)=>{
                                        if(items.itemTypeInfo.refname == "ALL"){
                                            return;
                                        }else{
                                            return (
                                                <ul onClick={ () =>{this.toggleEvent(items.itemTypeInfo.refname)}} className={items.itemTypeInfo.refname == this.state.curItemType?"activeList":""}>
                                                    <li className="agent-container-div">{items.itemTypeInfo.refname}</li>
                                                    <li className="agent-container-div">
                                                        <Popconfirm
                                                            title={langCheck('Customize-000007', 'pages', json)}/* 国际化处理： 确认删除该条单据类型吗?*/
                                                            cancelText={langCheck('Customize-000008', 'pages', json)}/* 国际化处理： 取消*/
                                                            okText={langCheck('Customize-000009', 'pages', json)}/* 国际化处理： 确定*/
                                                            onConfirm={ e =>{e.stopPropagation();this.deleteEvent(items,"itemTypeInfo")}}
                                                        >
                                                            <a className="agent-container-button">{langCheck('Customize-000013', 'pages', json)/* 国际化处理： 删除*/}</a>
                                                        </Popconfirm>
                                                    </li>
                                                </ul>
                                            );
                                        }
                                    })
                                }

                            </div>
                        </div>
                        <div className="agent-container-right">
                            <div className="agent-container-top">
                                <div className="agent-container-div">{langCheck('Customize-000014', 'pages', json)/* 国际化处理： 代理人信息*/}</div>
                                <div className="agent-container-div">
                                    <UserRefer
                                        value=""
                                        placeholder={langCheck('Customize-000010', 'pages', json)}/* 国际化处理： 添加代理人*/
                                        onChange={value => {
                                            this.handdleRefChange(value, "agentInfo");
                                        }}
                                        clickContainer={<Button className="agent-container-button">{langCheck('Customize-000010', 'pages', json)}</Button>}/* 国际化处理： 添加代理人*/
                                    />
                                </div>
                            </div>
                            <ul className="agent-info-top">
                                <li>{langCheck('Customize-000015', 'pages', json)/* 国际化处理： 序号*/}</li>
                                <li>{langCheck('Customize-000016', 'pages', json)/* 国际化处理： 代理人编码*/}</li>
                                <li>{langCheck('Customize-000017', 'pages', json)/* 国际化处理： 代理人名称*/}</li>
                                <li>{langCheck('Customize-000018', 'pages', json)/* 国际化处理： 操作*/}</li>
                            </ul>
                            <div className="agent-info-content">
                                {
                                    curAgentInfo.length>0?<SortableList json={json} items={curAgentInfo} deleteEvent={this.deleteEvent} DataCheck={this.DataCheck} />:<div className="CoverPosition-content-treeCardTable"><p>{langCheck('Customize-000019', 'pages', json)/* 国际化处理： 暂无数据*/}</p></div>}
                            </div>
                                
                        </div>
                    </div>
                    <div className="default-footer">
                        <Button
                            type="primary"
                            disabled={disabled}
                            onClick={this.getAllData}
                        >
                            {langCheck('Customize-000020','pages', json)/* 国际化处理： 应用*/}
                        </Button>
                    </div>
                </div>
            </ComLayout>
        )
    }
}

export default connect(
    state => {
        return {
            userId: state.appData.userId,
            userName: state.appData.userName
        };
    }
)(AgentSetting);

import React, { Component } from "react";
import { connect } from "react-redux";
import {
    updateSelectCard,
    updateAreaList,
    clearData
} from "Store/ZoneSetting/action";
import Ajax from "Pub/js/ajax";
import "./index.less";
import withDragDropContext from "Pub/js/withDragDropContext";
import AreaItem from "./areaItem";
import TreeModal from "./treeModal";
import _ from "lodash";
import Notice from "Components/Notice";
import { langCheck } from 'Pub/js/utils';
//内容组件类
class MyContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            metaTree: [],
            targetAreaID: "",
            targetAreaType: "",
            canSelectTreeNodeList: []
        };
    }
    componentWillUnmount() {
        this.props.clearData();
    }
    //请求区域数据areaList
    componentDidMount() {
        let { json } = this.props;
        Ajax({
            url: `/nccloud/platform/templet/querytempletpro.do`,
            info: {
                name: langCheck('ZoneSetting-000017', 'pages', json),/* 国际化处理： 单据模板设置*/
                action: langCheck('ZoneSetting-000018', 'pages', json)/* 国际化处理： 配置模板区域-配置区域查询*/
            },
            data: {
                templetid: this.props.templetid
            },
            loading: true,//发送保存请求时页面显示loading
            success: res => {
                if (res) {
                    let { data, success } = res.data;
                    if (success && data && data.length >= 0) {
                        let areaList = [];
                        if (this.props.status === "searchTemplate") {
                            // 实施态
                            _.forEach(data, d => {
                                let tmpArea = {
                                    ...d
                                };
                                if (tmpArea.areatype === "0") {
                                    areaList.push(tmpArea);
                                }
                            });
                        } else if (
                            this.props.status === "templateSetting" ||
                            this.props.status === "templateSetting-unit"
                        ) {
                            // 实施态
                            _.forEach(data, d => {
                                let tmpArea = {
                                    ...d
                                };
                                if (tmpArea.areatype !== "0") {
                                    tmpArea.queryPropertyList =
                                        d.formPropertyList;
                                    _.forEach(tmpArea.queryPropertyList, q => {
                                        (q.pk_query_property =
                                            q.pk_form_property),
                                            (q.myMetaPath = "");
                                    });
                                }
                                areaList.push(tmpArea);
                            });
                        } else {
                            // 开发态
                            _.forEach(data, d => {
                                let tmpArea = {
                                    ...d
                                };
                                //将非查询区域的数据form转为query，queryPropertyList统一进行处理，保存时再进行转换
                                if (tmpArea.areatype !== "0") {
                                    tmpArea.queryPropertyList =
                                        d.formPropertyList;
                                    _.forEach(tmpArea.queryPropertyList, q => {
                                        (q.pk_query_property =
                                            q.pk_form_property),
                                            (q.myMetaPath = "");
                                    });
                                }
                                areaList.push(tmpArea);
                            });
                        }
                        this.props.updateAreaList(areaList);
                    }
                }
            }
        });
    }
    //设置元数据树模态框是否可见
    setModalVisible = modalVisible => {
        this.setState({ modalVisible });
    };
    /**
     * 打开元数据树的模态框
     * @param {String} metaid
     * @param {String} targetAreaID 目标区域ID
     * @param {String} areatype 区域类型
     **/
    addMetaInArea = (metaid, targetAreaID, areatype) => {
        let { json } = this.props;
        if (metaid === "" || metaid === null) {
            Notice({ status: "warning", msg: langCheck('ZoneSetting-000019', 'pages', json) });/* 国际化处理： 请关联元数据*/
            return;
        }
        Ajax({
            url: `/nccloud/platform/templet/querymetapro.do`,
            info: {
                name: langCheck('ZoneSetting-000017', 'pages', json),/* 国际化处理： 单据模板设置*/
                action: langCheck('ZoneSetting-000020', 'pages', json)/* 国际化处理： 元数据树结构查询*/
            },
            data: {
                metaid: metaid
            },
            success: res => {
                if (res) {
                    let { data, success } = res.data;
                    if (success && data && data.rows && data.rows.length > 0) {
                        let metaTree = [];
                        //元数据树最外层树结构的拼接
                        data.rows.map((r, index) => {
                            metaTree.push({
                                ...r,
                                title: `${r.refcode} ${r.refname}`,
                                key: `${r.refcode}`,
                                myUniqID: `${r.refcode}`,
                                isLeaf: r.isleaf
                            });
                        });
                        //数据类型205的，即可以全选该节点下面的叶子节点，需要模态框中显示select进行选择
                        let canSelectTreeNodeList = [];
                        _.forEach(metaTree, m => {
                            if (m.datatype === "205") {
                                canSelectTreeNodeList.push(m);
                            }
                        });
                        this.setState({
                            metaTree: metaTree,
                            targetAreaID: targetAreaID,
                            targetAreaType: areatype,
                            canSelectTreeNodeList: canSelectTreeNodeList
                        });
                        this.setModalVisible(true);
                    } else {
                        if (success && data && data.rows && !data.rows.length) {
                            Notice({ status: "warning", msg: langCheck('ZoneSetting-000021', 'pages', json) });/* 国际化处理： 元数据树为空*/
                        }
                    }
                }
            }
        });
    };
    //更新元数据树的数据
    updateMetaTreeData = metaTree => {
        this.setState({ metaTree: metaTree });
    };
    //添加卡片
    addCard = addCardList => {
        let { targetAreaID } = this.state;
        let { areaList } = this.props;
        areaList = _.cloneDeep(areaList);
        let targetAreaIndex = -1;
        let metaid = "";
        //从areaList中确定目标区域
        _.forEach(areaList, (a, i) => {
            if (targetAreaID === a.pk_area) {
                targetAreaIndex = i;
                metaid = a.metaid;
                return false;
            }
        });
        //以code为主键，去重
        areaList[targetAreaIndex].queryPropertyList = _.uniqBy(
            areaList[targetAreaIndex].queryPropertyList.concat(addCardList),
            "code"
        );
        //初始化卡片position和classid属性
        _.forEach(areaList[targetAreaIndex].queryPropertyList, (q, i) => {
            q.position = i + 1;
            q.classid = metaid;
        });
        this.props.updateAreaList(areaList);
    };
    /**
     * 移动卡片
     * @param {Number} dragIndex 拖拽卡片的index
     * @param {Number} hoverIndex 目标卡片的index
     * @param {Number} areaItemIndex 目标区域的index
     **/
    moveCard = (dragIndex, hoverIndex, areaItemIndex) => {
        let { areaList } = this.props;
        areaList = _.cloneDeep(areaList);
        const cards = areaList[areaItemIndex].queryPropertyList;

        const dragCard = cards[dragIndex];
        cards.splice(dragIndex, 1);
        cards.splice(hoverIndex, 0, dragCard);
        _.forEach(cards, (q, i) => {
            q.position = i + 1;
        });
        this.props.updateAreaList(areaList);
        this.props.updateSelectCard({});
    };
    /**
     * 删除卡片
     * @param {Number} cardIndex 目标卡片index
     * @param {Number} areaItemIndex 目标区域的index
     **/
    deleteCard = (cardIndex, areaItemIndex) => {
        let { areaList } = this.props;
        areaList = _.cloneDeep(areaList);

        const cards = areaList[areaItemIndex].queryPropertyList;

        cards.splice(cardIndex, 1);

        this.props.updateAreaList(areaList);
        this.props.updateSelectCard({});
    };
    /**
     * 选择卡片
     * @param {Number} cardIndex 目标卡片index
     * @param {Number} areaItemIndex 目标区域的index
     **/
    selectThisCard = (cardIndex, areaItemIndex) => {
        let { areaList } = this.props;
        let card = areaList[areaItemIndex].queryPropertyList[cardIndex];
        this.props.updateSelectCard(card);
    };

    render() {
        let { json } = this.props;
        return (
            <div className="template-setting-content">
                {this.props.areaList.map((a, i) => {
                    return (
                        <AreaItem
                            areaItem={a}
                            key={i}
                            areaListLength={this.props.areaList.length}
                            id={a.pk_area}
                            index={i}
                            areatype={a.areatype}
                            metaid={a.metaid}
                            moveCard={this.moveCard}
                            deleteCard={this.deleteCard}
                            addMetaInArea={this.addMetaInArea}
                            selectThisCard={this.selectThisCard}
                            json={this.props.json}
                        />
                    );
                })}
                {/* 元数据树模态框 */}
                <TreeModal
                    metaTree={this.state.metaTree}
                    canSelectTreeNodeList={this.state.canSelectTreeNodeList}
                    modalVisible={this.state.modalVisible}
                    targetAreaID={this.state.targetAreaID}
                    targetAreaType={this.state.targetAreaType}
                    targetAreaCardLength={this.state.targetAreaCardLength}
                    setModalVisible={this.setModalVisible}
                    addCard={this.addCard}
                    updateMetaTreeData={this.updateMetaTreeData}
                    json={this.props.json}
                />
            </div>
        );
    }
}
export default connect(
    state => ({
        areaList: state.zoneSettingData.areaList
    }),
    {
        clearData,
        updateAreaList,
        updateSelectCard
    }
)(withDragDropContext(MyContent));

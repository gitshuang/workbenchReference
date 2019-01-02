import React, { Component } from "react";
import { Icon, Checkbox } from "antd";
import { connect } from "react-redux";
import MyCard from "./card";
import { updateSelectCard } from "Store/ZoneSetting/action";
import BatchSettingModal from "./batchSettingModal";
import AddNotMetaDataModal from "./addNotMetaDataModal";
import { langCheck } from 'Pub/js/utils';
//区域组件类
class AreaItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: props.areaListLength > 1 ? false : true,
            batchSettingModalVisibel: false,
            addDataModalVisibel: false,
            shouldHideGray: false
        };
    }
    //移动卡片
    moveCard = (dragIndex, hoverIndex) => {
        this.props.moveCard(dragIndex, hoverIndex, this.props.index);
    };
    //删除卡片
    deleteCard = cardIndex => {
        this.props.deleteCard(cardIndex, this.props.index);
    };
    //新增元数据
    addMetaInArea = () => {
        this.props.addMetaInArea(
            this.props.metaid,
            this.props.id,
            this.props.areatype
        );
    };
    //选择某个卡片
    selectThisCard = cardIndex => {
        this.props.selectThisCard(cardIndex, this.props.index);
    };
    //打开批量设置模态框
    openBatchSetting = () => {
        this.props.updateSelectCard({});
        this.setModalVisibel(true);
    };
    //设置批量设置模态框的显示/隐藏
    setModalVisibel = visibel => {
        this.setState({ batchSettingModalVisibel: visibel });
    };
    //打开新增非元数据模态框
    openAddNotMetaInArea = () => {
        this.setAddDataModalVisibel(true);
    };
    //设置新增非元数据模态框的显示/隐藏
    setAddDataModalVisibel = visibel => {
        this.setState({ addDataModalVisibel: visibel });
    };
    //显示/隐藏整个区域
    showOrHideAreaItem = () => {
        this.setState({ isShow: !this.state.isShow });
    };
    render() {
        const { areaItem, selectCard, json } = this.props;
        //如果传入区域描述为null，则显示区域名称
        if (areaItem.areadesc !== null && areaItem.areadesc != '' && areaItem.areadesc != undefined) {
            areaItem.name = areaItem.areadesc;
        }
        return (
            <div className="area-item">
                <div className="area-item-header">
                    <span
                        className="area-item-name"
                        onClick={this.showOrHideAreaItem}
                    >
                        {(() => {
                            const showOrHide = this.state.isShow ? (
                                <i
                                 title={langCheck('ZoneSetting-000011', 'pages', json)}/* 国际化处理： 收起*/
                                 className="iconfont icon-bottom"
                             ></i>
                            ) : (
                                 <i
                                 title={langCheck('ZoneSetting-000012', 'pages', json)}/* 国际化处理： 展开*/
                                 className="iconfont icon-right"
                             ></i>
                                
                            );
                            return <span>{showOrHide}</span>;
                        })()}
                        &nbsp;{areaItem.name}
                    </span>
                    <span className="area-item-button">
                        <Checkbox
                            onChange={e => {
                                this.setState({
                                    shouldHideGray: e.target.checked
                                });
                            }}
                        >
                            {langCheck('ZoneSetting-000013', 'pages', json)}
                            {/* /* 国际化处理： 隐藏不显示属性*/ }
                        </Checkbox>
                        <a onClick={this.addMetaInArea}>{langCheck('ZoneSetting-000014', 'pages', json)}</a>
                        {/* /* 国际化处理： 新增元数据*/ }
                        <a onClick={this.openAddNotMetaInArea}>{langCheck('ZoneSetting-000004', 'pages', json)}</a>
                        {/* /* 国际化处理： 新增非元数据*/ }
                        <a onClick={this.openBatchSetting}>{langCheck('ZoneSetting-000015', 'pages', json)}</a>
                        {/* /* 国际化处理： 批量设置*/ }
                    </span>
                </div>
                <ul
                    className="area-item-content"
                    style={{ display: this.state.isShow ? "block" : "none" }}
                >
                    {areaItem.queryPropertyList.map((q, index) => {
                        return (
                            <MyCard
                                index={index}
                                key={index}
                                shouldHideGray={this.state.shouldHideGray}
                                id={q.pk_query_property}
                                name={q.label}
                                areaid={areaItem.pk_area}
                                visible={q.visible}
                                color={q.color}
                                required={q.required}
                                selectThisCard={this.selectThisCard}
                                moveCard={this.moveCard}
                                deleteCard={this.deleteCard}
                            />
                        );
                    })}
                </ul>
                <BatchSettingModal
                    batchSettingModalVisibel={
                        this.state.batchSettingModalVisibel
                    }
                    areaIndex={this.props.index}
                    setModalVisibel={this.setModalVisibel}
                    json={this.props.json}
                />
                <AddNotMetaDataModal
                    areatype={this.props.areatype}
                    addDataModalVisibel={this.state.addDataModalVisibel}
                    areaIndex={this.props.index}
                    setAddDataModalVisibel={this.setAddDataModalVisibel}
                    json={this.props.json}
                />
            </div>
        );
    }
}
export default connect(
    state => ({}),
    {
        updateSelectCard
    }
)(AreaItem);

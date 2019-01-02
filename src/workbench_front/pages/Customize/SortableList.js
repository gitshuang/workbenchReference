import React, { Component } from "react";
import { sortable } from 'react-sortable';
import { Popconfirm } from "antd";
import { langCheck } from "Pub/js/utils.js";
class Item extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { json } =this.props;
    return (
      <ul {...this.props}>
          <li>{this.props["data-id"] + 1}</li>
          <li>{this.props.children.refcode}</li>
          <li>{this.props.children.refname}</li>
          <li>
              {/* <a onClick={()=>{this.props.deleteEvent(this.props.children,"agentInfo")}}>删除</a> */}
              <Popconfirm
                  title={langCheck('Customize-000023', 'pages', json)}/* 国际化处理： 确认删除该代理人吗?*/
                  cancelText={langCheck('Customize-000008', 'pages', json)}/* 国际化处理： 取消*/
                  okText={langCheck('Customize-000009', 'pages', json)}/* 国际化处理： 确定*/
                  onConfirm={()=>{this.props.deleteEvent(this.props.children,"agentInfo")}}
              >
                  <a className="agent-container-button">{langCheck('Customize-000013', 'pages', json)/* 国际化处理： 删除*/}</a>
              </Popconfirm>
              <a><i className="iconfont icon-tuodong"/></a>
          </li>
      </ul>
      
    )
  }
}
  var SortableItem = sortable(Item);
  
class SortableList extends React.Component {
    onSortItems = (items) => {
      this.setState({
        items: items
      },()=>this.props.DataCheck());
    }
  
    render() {
      const { items } = this.props;
      var listItems = items.map((item, i) => {
        return (
          <SortableItem
                key={i}
                onSortItems={this.onSortItems}
                items={items}
                sortId={i}
                deleteEvent={this.props.deleteEvent}
                json={this.props.json}
            >{item}</SortableItem>
        );
      });
      return (
        <div className='sortable-list'>
          {listItems}
        </div>
      )
    }
  };
  export default SortableList;

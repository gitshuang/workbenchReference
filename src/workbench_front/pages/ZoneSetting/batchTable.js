import React, { Component } from 'react';
import { connect } from 'react-redux';
import { batchSearchData, batchFormData, batchTableData } from './utilService';
import { Table, Input, Button, Icon, Dropdown, Popover, Checkbox } from 'antd';
import _ from 'lodash';
import {
    EditableCell,
    EditableCheck,
    SelectCell,
    EditAllCell
} from './editableCell';
//批量设置组件类
//基于ant的table组件的封装
export default class BatchTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [];
        this.state = {
            visible: false,
        };
    }
    //input下拉框的显示/隐藏
    //注：未启用该下拉
    handleVisibleChange = (visible, index) => {
        if (visible === false) {
            return;
        }
        this.setState({ [`visible${index}`]: visible });
    };
    //input下拉框的隐藏
    //注：未启用该下拉
    hidePopover = index => {
        this.setState({ [`visible${index}`]: false });
    };
    /**
     * 闭包 只对具体的单元格修改，需要知道更新具体哪一行（横向）&哪一个属性（纵向）
     * @param {index} 需要知道更新数据所在行，比如index=0为第一行
     * @param {property} 需要知道更新数据所归属属性，比如code为更新编码
     * @return {function} 返回方法体，调用的地方传入需要更改的value值
     */
    onCellChange = (index, property) => {
        return value => {
            let { newSource } = this.props;
            newSource = _.cloneDeep(newSource);
            let target = newSource[index];
            if (target) {
                target[property] = value;
                this.props.saveNewSource(newSource);
            }
        };
    };
    /**
     * 闭包 只对具体的单元格修改，需要知道更新具体哪一行（横向）&哪一个属性（纵向）
     * @param {index} 需要知道更新数据所在行，比如index=0为第一行
     * @param {property} 需要知道更新数据所归属属性，比如code为更新编码
     * @return {function} 返回方法体，调用的地方传入需要更改的value值
     */
    onCheckedChange = (index, property) => {
        return value => {
            let { newSource } = this.props;
            newSource = _.cloneDeep(newSource);
            let target = newSource[index];
            if (target) {
                target[property] = value;
                this.props.saveNewSource(newSource);
            }
        };
    };
    /**
     * 闭包 一纵列单元格修改，需要知道更新哪一个属性
     * @param {property} 需要知道更新数据所归属属性，比如code为更新编码
     * @return {function} 返回方法体，调用的地方传入需要更改的value值
     */
    onAllColCellChange = property => {
        return value => {
            this.saveAllCellValue(value, property);
        };
    };
    /**
     * 保存一纵列单元格
     * @param {value} 需要更新的值
     * @param {property} 需要更新的属性key
     */
    saveAllCellValue = (value, property) => {
        let { newSource } = this.props;
        newSource = _.cloneDeep(newSource);
        _.forEach(newSource, n => {
            n[property] = value;
        });
        this.props.saveNewSource(newSource);
    };
    /**
     * 中间态公共方法
     * @param {arr} 创建的新数组
     * @param {region} 需要更新的区域（表单/表格/查询）
     * @param {property} 每个区域需要更新的属性
     */
    publicIndeterminate = (arr, region, property) => {
        if (arr.includes(true) && (arr.includes(null) || (arr.includes(false)))) {
            _.forEach(region, (bat, i) => {
                if (bat.property == property) {
                    bat.indeterminate = true;
                    bat.checkAll = false;
                }
                return;
            })
        }else if (!arr.includes(true)) {
            _.forEach(region, (bat, i) => {
                if (bat.property == property) {
                    bat.indeterminate = false;
                    bat.checkAll = false;
                }
                return;
            })
        }else {
            _.forEach(region, (bat, i) => {
                if (bat.property == property) {
                    bat.indeterminate = false;
                    bat.checkAll = true;
                }
                return;
            })
        }
        arr = [];
    }
    render() {
        let { newSource, areatype } = this.props;
        //给每一个卡片添加table渲染所需的唯一key
        _.forEach(newSource, (n, i) => {
            n.key = i;
        });
        let columns = [];
        let scrollTableWidth = 0;
        let batchData = [];
        //查询区、表单区、表格区，根据区域类型的不同，进行不同的赋值，从utilService中获取字典
        if (areatype === '0') {
            let isnotmetaArr = [], isuseArr = [],
                disabledArr = [], visibleArr = [],
                ismultiselectedenabledArr = [], isfixedconditionArr = [],
                requiredArr = [], isqueryconditionArr = [],
                containlowerArr = [], ischeckArr = [],
                isbeyondorgArr = [], usefuncArr = [];
            //查询区
            batchData = batchSearchData();
            _.forEach(newSource, (vv, indx) => {
                isnotmetaArr.push(vv.isnotmeta);
                isuseArr.push(vv.isuse);
                disabledArr.push(vv.disabled);
                visibleArr.push(vv.visible);
                ismultiselectedenabledArr.push(vv.ismultiselectedenabled);
                isfixedconditionArr.push(vv.isfixedcondition);
                requiredArr.push(vv.required);
                isqueryconditionArr.push(vv.isquerycondition);
                containlowerArr.push(vv.containlower);
                ischeckArr.push(vv.ischeck);
                isbeyondorgArr.push(vv.isbeyondorg);
                usefuncArr.push(vv.usefunc);
            });
            this.publicIndeterminate(isnotmetaArr, batchData, 'isnotmeta')
            this.publicIndeterminate(isuseArr, batchData, 'isuse')
            this.publicIndeterminate(disabledArr, batchData, 'disabled')
            this.publicIndeterminate(visibleArr, batchData, 'visible')
            this.publicIndeterminate(ismultiselectedenabledArr, batchData, 'ismultiselectedenabled')
            this.publicIndeterminate(isfixedconditionArr, batchData, 'isfixedcondition')
            this.publicIndeterminate(requiredArr, batchData, 'required')
            this.publicIndeterminate(isqueryconditionArr, batchData, 'isquerycondition')
            this.publicIndeterminate(containlowerArr, batchData, 'containlower')
            this.publicIndeterminate(ischeckArr, batchData, 'ischeck')
            this.publicIndeterminate(isbeyondorgArr, batchData, 'isbeyondorg')
            this.publicIndeterminate(usefuncArr, batchData, 'usefunc')
        } else if (areatype === '1') {
            let isreviseArr = [], isnextrowArr = [],
            visibleArr = [], requiredArr = [],
            disabledArr = [];
            //表单
            batchData = batchFormData();
            _.forEach(newSource, (vv, indx) => {
                isreviseArr.push(vv.isrevise);
                isnextrowArr.push(vv.isnextrow);
                visibleArr.push(vv.visible);
                requiredArr.push(vv.required);
                disabledArr.push(vv.disabled);
            });
            this.publicIndeterminate(isreviseArr, batchData, 'isrevise');
            this.publicIndeterminate(isnextrowArr, batchData, 'isnextrow');
            this.publicIndeterminate(visibleArr, batchData, 'visible');
            this.publicIndeterminate(requiredArr, batchData, 'required');
            this.publicIndeterminate(disabledArr, batchData, 'disabled');

        } else {
            let isreviseArr = [], istotalArr = [],
            visibleArr = [], requiredArr = [],
            disabledArr = [];
            //表格
            batchData = batchTableData();
            _.forEach(newSource, (vv, indx) => {
                isreviseArr.push(vv.isrevise);
                istotalArr.push(vv.istotal);
                visibleArr.push(vv.visible);
                requiredArr.push(vv.required);
                disabledArr.push(vv.disabled);
            });
            this.publicIndeterminate(isreviseArr, batchData, 'isrevise');
            this.publicIndeterminate(istotalArr, batchData, 'istotal');
            this.publicIndeterminate(visibleArr, batchData, 'visible');
            this.publicIndeterminate(requiredArr, batchData, 'required');
            this.publicIndeterminate(disabledArr, batchData, 'disabled');
        }
        //循环批量设置的字典，
        _.forEach(batchData, (data, index) => {
            let tmpColData = {
                dataIndex: data.property,
                width: data.width
            };
            if (tmpColData.dataIndex === 'label') {
                tmpColData.fixed = 'left';
            }
            if (tmpColData.dataIndex === 'code') {
                tmpColData.fixed = 'left';
            }
            //累加宽度，计算scroll值
            scrollTableWidth += data.width;
            //input的下拉框进行一纵列批改，
            //勿删，可能后期会使用
            //<Popover
            //     overlayClassName="all-apps-popover"
            //     getPopupContainer={() => {
            //         return document.querySelector(
            //             ".zonesetting-batch-setting-modal"
            //         );
            //     }}
            //     content={
            //         <EditAllCell
            //             property={data.property}
            //             hidePopover={()=>{this.hidePopover(index)}}
            //             onChange={this.onAllColCellChange(
            //                 data.property
            //             )}
            //         />
            //     }
            //     visible={this.state[`visible${index}`]}
            //     onVisibleChange={(visible)=>{this.handleVisibleChange(visible,index)}}
            //     placement="bottomLeft"
            //     trigger="click"
            // >
            //     {data.title} <Icon type="down" />
            // </Popover>

            // console.log('batchData', batchData);
            // console.log('tmpColData', tmpColData);
            //根据类型不同，渲染不同的表头单元格
            if (data.type === 'checkbox') {
                //如果是checkbox，则表头为控制全选与否的checkbox组件
                tmpColData.title = (
                    <Checkbox
                        onChange={e => {
                            this.saveAllCellValue(
                                e.target.checked,
                                data.property
                            );
                        }}
                        indeterminate={data.indeterminate}
                        checked={data.checkAll}
                    >
                        {data.title}
                    </Checkbox>
                );
            } else {
                //其他类型，表头都是静态文本
                tmpColData.title = data.title;
            }
            //根据类型不同，渲染不同的表体单元格
            switch (data.type) {
                case 'input':
                    tmpColData.render = (text, record, index) => {
                        return (
                            <EditableCell
                                value={text}
                                property={data.property}
                                updateValue={this.onCellChange(
                                    index,
                                    data.property
                                )}
                            />
                        );
                    };
                    break;
                case 'checkbox':
                tmpColData.render = (text, record, index) => {
                        return (
                            <EditableCheck
                                value={text}
                                property={data.property}
                                onChange={this.onCellChange(
                                    index,
                                    data.property
                                )}
                            />
                        );
                    };
                    break;
                case 'select':
                    tmpColData.render = (text, record, index) => {
                        return (
                            <SelectCell
                                selectValue={text}
                                property={data.property}
                                selectObj={data.selectObj}
                                onChange={this.onCellChange(
                                    index,
                                    data.property
                                )}
                            />
                        );
                    };
                    break;
                case 'text':
                    tmpColData.title = data.title;
                    break;
            }
            //将所有结果压栈columns中，ant-table即可进行table渲染
            columns.push(tmpColData);
        });
        return (
            <Table
                bordered
                dataSource={newSource}
                columns={columns}
                pagination={false}
                scroll={{ x: scrollTableWidth, y: 400 }}
            />
        );
    }
}

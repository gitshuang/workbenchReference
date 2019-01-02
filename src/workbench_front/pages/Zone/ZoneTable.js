import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Input, Icon, Button, Popconfirm, Select, Modal } from 'antd';
import { DragSource, DropTarget } from 'react-dnd';
import withDragDropContext from 'Pub/js/withDragDropContext';
import update from 'immutability-helper';
import _ from 'lodash';
import { setNewList } from 'Store/Zone/action';
import Ajax from 'Pub/js/ajax';
import Notice from 'Components/Notice';
import { ControlTip } from 'Components/ControlTip';
import { langCheck } from 'Pub/js/utils';
import MdDefaultClassEntityRef from 'Components/Refers/mdDefaultClassEntityRef';
const Option = Select.Option;
// zhanglmg
function dragDirection(dragIndex, hoverIndex, initialClientOffset, clientOffset, sourceClientOffset) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return 'upward';
    }
}
let BodyRow = (props) => {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        moveRow,
        dragRow,
        clientOffset,
        sourceClientOffset,
        initialClientOffset,
        ...restProps
    } = props;
    const style = { ...restProps.style, cursor: 'move' };

    let className = restProps.className;
    if (isOver && initialClientOffset) {
        const direction = dragDirection(
            dragRow.index,
            restProps.index,
            initialClientOffset,
            clientOffset,
            sourceClientOffset
        );
        if (direction === 'downward') {
            className += ' drop-over-downward';
        }
        if (direction === 'upward') {
            className += ' drop-over-upward';
        }
    }

    return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />));
};
const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        if (dragIndex === hoverIndex) {
            return;
        }
        props.moveRow(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    }
};
const rowSource = {
    beginDrag(props) {
        return {
            index: props.index
        };
    }
};
BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset()
}))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset()
    }))(BodyRow)
);
/**
 * 按钮类型选择
 * @param {String} value
 */
const switchType = (value, json) => {
    switch (value) {
        case '2':
            return langCheck('102202APP-000031', "pages", json); /* 国际化处理： 表格区*/
        case '1':
            return langCheck('102202APP-000032', "pages", json); /* 国际化处理： 表单区*/
        case '0':
            return langCheck('102202APP-000033', "pages", json); /* 国际化处理： 查询区*/
        case 'browse':
            return langCheck('102202APP-000034', "pages", json); /* 国际化处理： 浏览*/
        case 'edit':
            return langCheck('102202APP-000035', "pages", json); /* 国际化处理： 编辑*/
        case true:
            return langCheck('102202APP-000065', "pages", json); /* 国际化处理： 展开*/
        case false:
            return langCheck('102202APP-000066', "pages", json); /* 国际化处理： 收起*/
        default:
            return typeof value === 'object' ? value.metaname : value;
    }
};
// 可编辑表格一个单项
class EditableCell extends Component {
    state = {
        value: this.props.value,
        editable: false
    };
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
    };
    isRepeat = (arr) => {
        var hash = {};
        for (var i in arr) {
            if (hash[arr[i]]) {
                return true;
            }
            hash[arr[i]] = true; // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
        }
        return false;
    };
    check = () => {
        let { json } = this.props;
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
        if (this.props.type && this.props.type === 'code') {
            let codeArray = [];
            this.props.dataSource.map((ele) => {
                codeArray.push(ele.code);
            });
            if (codeArray.length > 1) {
                if (this.isRepeat(codeArray) === true) {
                    Notice({ status: 'error', msg: langCheck('102202APP-000049', "pages", json) });
                    return;
                }
            }
        }
    };
    edit = () => {
        if (!this.state.editable) {
            this.setState({ editable: true }, () => {
                this.refs.myInput.focus();
            });
        }
    };
    render() {
        const { value, editable } = this.state;
        return (
            <div className='editable-cell' onClick={this.edit}>
                {editable ? (
                    <div className='editable-cell-input-wrapper'>
                        <Input
                            value={value}
                            onChange={this.handleChange}
                            onPressEnter={this.check}
                            onBlur={this.check}
                            ref='myInput'
                        />
                    </div>
                ) : (
                    <div className='my-editable-cell-text-wrapper'>
                        <span className='cell-show-value'>{value || ' '}</span>
                        <Icon type='edit' className='my-editable-cell-icon' onClick={this.edit} />
                    </div>
                )}
            </div>
        );
    }
}
// 可编辑表格下拉框
class EditableSelect extends Component {
    state = {
        value: this.props.value,
        editable: false,
        dataSource:this.props.dataSource
    };
    handleChange = (value) => {
        this.setState({ value }, () => {
            this.check();
        });
    };
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    };
    edit = () => {
        if (!this.state.editable) {
            this.setState({ editable: true });
        }
    };
    render() {
        const { value, editable, dataSource } = this.state;
        let { json } = this.props;
        console.log(((typeof value)=="boolean"?true:"") && switchType(value, json));
        return (
            <div className='editable-cell' onClick={this.edit}>
                {editable ? (
                    <div className='editable-cell-input-wrapper'>
                        <Select
                            showSearch
                            optionFilterProp='children'
                            value={value}
                            style={{ width: '100%' }}
                            onChange={(selected) => this.handleChange(selected)}
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                                {dataSource.map(ele=><Option value={ele.value}>{ele.title}</Option>)}
                        </Select>
                    </div>
                ) : (
                    <div className='my-editable-cell-text-wrapper'>
                        <span>{(((typeof value)=="boolean"?true:"") && switchType(value, json)) || ''}</span>
                        <Icon type='edit' className='my-editable-cell-icon' onClick={this.edit} />
                    </div>
                )}
            </div>
        );
    }
}

// 关联项与区域状态
class RelateSelect extends Component {
    state = {
        value: this.props.value,
        editable: false,
        type: this.props.type,
        data: this.props.data,
        num: this.props.num
    };
    handleChange = (value) => {
        this.setState({ value }, () => {
            this.check();
        });
    };
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    };
    edit = () => {
        if (!this.state.editable) {
            this.setState({ editable: true });
        }
    };
    render() {
        const { value, editable, num, type } = this.state;
        let { data, json } = this.props;
        data = _.cloneDeep(data);
        data =
            data &&
            data.filter((v, i) => {
                return v.key !== num;
            });
        return (
            <div className='editable-cell' onClick={this.edit}>
                {editable ? (
                    <div className='editable-cell-input-wrapper'>
                        {(() => {
                            if (type === 'relationcode') {
                                return (
                                    <Select
                                        showSearch
                                        optionFilterProp='children'
                                        value={value}
                                        style={{ width: '100%' }}
                                        onChange={(selected) => this.handleChange(selected)}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {data &&
                                            data.map((v, i) => {
                                                return (
                                                    <Option key={i} value={v.code}>
                                                        {v.code}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                );
                            } else if (type === 'areastatus') {
                                return (
                                    <Select
                                        showSearch
                                        optionFilterProp='children'
                                        value={value}
                                        style={{ width: '80%' }}
                                        onChange={(selected) => this.handleChange(selected)}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Option value={'browse'}>{langCheck('102202APP-000034', "pages", json)}</Option>
                                        {/* 国际化处理： 浏览*/}
                                        <Option value={'edit'}>{langCheck('102202APP-000035', "pages", json)}</Option>
                                        {/* 国际化处理： 编辑*/}
                                    </Select>
                                );
                            }
                        })()}
                    </div>
                ) : (
                    <div className='my-editable-cell-text-wrapper'>
                        <span className='cell-show-value'>{(value && switchType(value, json)) || ' '}</span>

                        <Icon type='edit' className='my-editable-cell-icon' onClick={this.edit} />
                    </div>
                )}
            </div>
        );
    }
}

// 可编辑表格参照
class EditableRefer extends Component {
    state = {
        value: this.props.value,
        editable: true,
        metaObj: {
            refcode: this.props.value.refcode,
            refname: this.props.value.metaname,
            refpk: this.props.value.metaid
        }
    };

    // 组件更新  obj[type]["refname"] = refname;
    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value,
            metaObj: {
                refcode: nextProps.value.refcode,
                refname: nextProps.value.metaname,
                refpk: nextProps.value.metaid
            }
        });
    }

    check = () => {
        this.setState({ editable: true });
        if (this.props.onChange) {
            this.props.onChange(this.state.metaObj);
        }
    };
    edit = () => {
        if (!this.state.editable) {
            this.setState({ editable: true });
        }
    };
    render() {
        const { value, editable } = this.state;
        let { json } = this.props;
        return (
            <div className='editable-cell' onClick={this.edit}>
                {true ? (
                    <div className='editable-cell-input-wrapper'>
                        <MdDefaultClassEntityRef
                            value={this.state.metaObj}
                            placeholder={langCheck('102202APP-000036', "pages", json)} /* 国际化处理： 关联元数据*/
                            onChange={(val) => {
                                this.setState(
                                    {
                                        metaObj: val
                                    },
                                    () => {
                                        this.check();
                                    }
                                );
                            }}
                        />
                    </div>
                ) : (
                    <div className='my-editable-cell-text-wrapper'>
                        <span>{(value && switchType(value, json)) || ' '}</span>

                        <Icon type='edit' className='my-editable-cell-icon' onClick={this.edit} />
                    </div>
                )}
            </div>
        );
    }
}

// 可编辑的表格
class ZoneTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            count: null,
            areaName: '', //区域名称
            areaCode: '', //区域编码
            areaPk: '', //区域主键
            areatype: '0', //区域类型
            position: 1, //序号
            metaname: null, //关联元数据
            areastatus: '', //区域状态
            relationcode: null, //关联编码
            visible: false,
            clazz: null, //设置类
            creationtime: null,
            creator: null,
            headcode: null,
            formPropertyList: null,
            metaid: '',
            metaspace: '',
            modifiedtime: null,
            modifer: null,
            pagination: null,
            queryPropertyList: null,
            templetid: '',
            resid: null,
            oldData: {
                areaCode: '',
                areaName: ''
            },
            previewPrintVisible: false,
            codeErrorMsg: '',
            nameErrorMsg: '',
            isunfold:true
        };
    }
    // 组件更新
    componentWillReceiveProps(nextProps) {
        if (nextProps.zoneDatas.areaList) {
            this.setState({
                dataSource: nextProps.zoneDatas.areaList.map((v, i) => {
                    v.key = i;
                    return v;
                }),
                count: nextProps.zoneDatas.areaList.length
            });

            // 设置初始 table数组
            this.props.setNewList(nextProps.zoneDatas.areaList);
        }
    }
    componentDidMount = () => {
        if (!this.props.templetid) {
            this.handleAdd();
        }
    };
    //复制行
    copyRow(record) {
        let { oldData } = this.state;
        oldData.areaCode = record.code;
        oldData.areaName = record.name;
        this.setState({
            visible: true,
            areaCode: record.code,
            areaName: record.name,
            areaPk: record.pk_area,
            oldData,
            areatype: record.areatype,
            metaname: record.metaname,
            areastatus: record.areastatus,
            relationcode: record.relationcode,
            clazz: record.clazz,
            creationtime: record.creationtime,
            creator: record.creator,
            headcode: record.headcode,
            formPropertyList: record.formPropertyList,
            metaid: record.metaid,
            metaspace: record.metaspace,
            modifiedtime: record.modifiedtime,
            modifer: record.modifer,
            pagination: record.pagination,
            queryPropertyList: record.queryPropertyList,
            templetid: record.templetid,
            resid: record.resid
        });
    }
    // 闭包 只对具体的单元格修改
    onCellChange = (key, dataIndex) => {
        return (value) => {
            const dataSource = [ ...this.state.dataSource ];
            const target = dataSource.find((item) => item.key === key);
            if (target) {
                if (dataIndex === 'metaname') {
                    target[dataIndex] = value && value.refname;
                    target['metaid'] = value && value.refpk;
                    target['refcode'] = value && value.refcode;
                } else {
                    target[dataIndex] = value;
                }
                this.setState({ dataSource }, () => {
                    this.props.setNewList(this.state.dataSource);
                });
            }
        };
    };
    onDelete = (key) => {
        const dataSource = [ ...this.state.dataSource ];
        this.setState({ dataSource: dataSource.filter((item) => item.key !== key) }, () => {
            this.props.setNewList(this.state.dataSource);
        });
    };

    handleAdd = () => {
        const { templetid } = this.props;
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: '',
            templetid,
            code: '',
            metaid: '',
            metaname: '',
            areatype: '1',
            areastatus: 'browse',
            relationcode: '',
            isunfold:true
        };
        this.setState(
            {
                dataSource: [ ...dataSource, newData ],
                count: count + 1
            },
            () => {
                this.props.setNewList(this.state.dataSource);
            }
        );
    };
    //删除左右两端的空格
    trim = (str) => {
        if (str) {
            return str.replace(/^\s+|\s+$/g, '');
        }
    };
    checkCode = () => {
        let { json } = this.props;
        let { areaCode, oldData } = this.state;
        if (!this.trim(areaCode)) {
            document.getElementById('areaCode').classList.add('has-error');
            this.setState({
                codeErrorMsg: langCheck('102202APP-000047', "pages", json) //  编码不能为空
            });
            return;
        }
        document.getElementById('areaCode').classList.remove('has-error');
        if (areaCode === oldData.areaCode) {
            document.getElementById('areaCode').classList.add('has-error');
            this.setState({
                codeErrorMsg: langCheck('102202APP-000049', "pages", json) //  编码不能重复
            });
            return;
        }
        this.setState({
            codeErrorMsg: '' //  编码不能为空
        });
    };
    checkName = () => {
        let { json } = this.props;
        let { areaName } = this.state;
        if (!this.trim(areaName)) {
            document.getElementById('areaName').classList.add('has-error');
            this.setState({
                nameErrorMsg: langCheck('102202APP-000048', "pages", json) //名称不能为空
            });
            return;
        }
        this.setState({
            nameErrorMsg: ''
        });
        document.getElementById('areaName').classList.remove('has-error');
    };
    //复制保存
    handleOk = (e) => {
        let {
            areaCode,
            areaName,
            areaPk,
            count,
            dataSource,
            areatype,
            metaname,
            areastatus,
            relationcode,
            clazz,
            creationtime,
            creator,
            headcode,
            formPropertyList,
            metaid,
            metaspace,
            modifiedtime,
            modifer,
            pagination,
            queryPropertyList,
            templetid,
            resid,
            oldData,
            isunfold
        } = this.state;
        let { json } = this.props;
        let infoData = {
            areaid: areaPk,
            code: areaCode,
            name: areaName
        };
        if (!this.trim(areaCode) || !this.trim(areaName) || areaCode === oldData.areaCode) {
            return;
        }
        Ajax({
            url: `/nccloud/platform/templet/copyarea.do`,
            data: infoData,
            info: {
                name: langCheck('102202APP-000050', "pages", json) /* 国际化处理： 区域复制*/,
                action: langCheck('102202APP-000050', "pages", json) /* 国际化处理： 区域复制*/
            },
            success: ({ data }) => {
                if (data.success) {
                    Notice({ status: 'success', msg: langCheck('102202APP-000051', "pages", json) }); /* 国际化处理： 复制成功*/
                    this.setState({
                        visible: false
                    });
                    const newData = {
                        key: count,
                        name: areaName,
                        templetid: '',
                        code: areaCode,
                        metaid: '',
                        pk_area: data.data,
                        areatype: areatype,
                        isunfold: isunfold,
                        metaname: metaname,
                        areastatus: areastatus,
                        relationcode: relationcode,
                        clazz: clazz,
                        creationtime: creationtime,
                        creator: creator,
                        headcode: headcode,
                        formPropertyList: formPropertyList,
                        metaid: metaid,
                        metaspace: metaspace,
                        modifiedtime: modifiedtime,
                        modifer: modifer,
                        pagination: pagination,
                        queryPropertyList: queryPropertyList,
                        templetid: templetid,
                        resid: resid
                    };
                    this.setState(
                        {
                            dataSource: [ ...dataSource, newData ],
                            count: count + 1
                        },
                        () => {
                            this.props.setNewList(this.state.dataSource);
                        }
                    );
                }
            }
        });
    };
    handleCancel = (e) => {
        let { oldData } = this.state;
        this.setState({
            visible: false,
            areaCode: oldData.areaCode,
            areaName: oldData.areaName
        });
    };
    components = {
        body: {
            row: BodyRow
        }
    };
    moveRow = (dragIndex, hoverIndex) => {
        let { dataSource } = this.state;
        const dragRow = dataSource[dragIndex];
        let sortData = update(dataSource, {
            $splice: [ [ dragIndex, 1 ], [ hoverIndex, 0, dragRow ] ]
        });
        this.setState({
            dataSource: sortData
        });
        this.props.setNewList(sortData);
    };
    //浏览摸态框显示方法
    showModal = () => {
        let { json } = this.props;
        ControlTip({
            status: 'warning',
            title: langCheck('102202APP-000062', "pages", json) /* 国际化处理： 修复错误数据*/,
            msg: langCheck('102202APP-000052', "pages", json) /* 国际化处理： 确定要修复错误数据?*/,
            onOk: () => {
                this.setState({ previewPrintVisible: true }, () => {
                    this.cleanDataFun();
                });
            }
        });
    };
    //浏览摸态框隐藏方法
    hideModal = () => {
        this.setState({ previewPrintVisible: false });
    };
    cleanDataFun = () => {
        let { json } = this.props;
        let infoData = {
            templetid: this.props.templetid
        };
        Ajax({
            url: `/nccloud/platform/templet/checkpropertys.do`,
            data: infoData,
            loading: true,
            info: {
                name: langCheck('102202APP-000053', "pages", json) /* 国际化处理： 洗数据*/,
                action: langCheck('102202APP-000053', "pages", json) /* 国际化处理： 洗数据*/
            },
            success: ({ data }) => {
                if (data.success) {
                    document.getElementsByClassName('printContent')[0].innerHTML = data.data;
                }
            }
        });
    };
    areaTypeDatas=(json)=>{
        return [
        {value:"0",title:langCheck('102202APP-000033', "pages", json)},//
        {value:"1",title:langCheck('102202APP-000032', "pages", json)},//
        {value:"2",title:langCheck('102202APP-000031', "pages", json)}//
    ]};
    isunfoldDatas=(json)=>{
        return [
            {value:true,title:langCheck('102202APP-000065', "pages", json)},//展开
            {value:false,title:langCheck('102202APP-000066', "pages", json)}//收起
        ];
    }
    render() {
        let {
            dataSource,
            visible,
            areaCode,
            areaName,
            areaPk,
            previewPrintVisible,
            codeErrorMsg,
            nameErrorMsg
        } = this.state;
        let { json } = this.props;
        let columns = [
            {
                title: langCheck('102202APP-000037', "pages", json) /* 国际化处理： 序号*/,
                dataIndex: 'position',
                //fixed: 'left',
                width: '5%'
            },
            {
                title: langCheck('102202APP-000038', "pages", json) /* 国际化处理： 区域编码*/,
                className: 'required-tableCell',
                dataIndex: 'code',
                width: '10%',
                render: (text, record) => (
                    <EditableCell
                        value={text}
                        onChange={this.onCellChange(record.key, 'code')}
                        json={json}
                        type={'code'}
                        dataSource={dataSource}
                    />
                )
            },
            {
                title: langCheck('102202APP-000039', "pages", json) /* 国际化处理： 区域名称*/,
                className: 'required-tableCell',
                dataIndex: 'name',
                width: '10%',
                render: (text, record) => (
                    <EditableCell value={text} onChange={this.onCellChange(record.key, 'name')} json={json} />
                )
            },
            {
                title: langCheck('102202APP-000040', "pages", json) /* 国际化处理： 区域类型*/,
                dataIndex: 'areatype',
                width: '10%',
                render: (text, record) => {
                    if (record.pk_area) {
                        return <span>{switchType(text, json)}</span>;
                    }
                    return (
                        <EditableSelect value={text} onChange={this.onCellChange(record.key, 'areatype')} dataSource={this.areaTypeDatas(json)} json={json} />
                    );
                }
            },
            {
                title: langCheck('102202APP-000064', "pages", json) /* 国际化处理： 展开/收起*/,
                dataIndex: ' isunfold',
                width: '5%',
                render: (text, record) => {
                    return (
                        <EditableSelect value={record.isunfold} onChange={this.onCellChange(record.key, 'isunfold')} dataSource={this.isunfoldDatas(json)} json={json} />
                    );
                }
            },
            {
                title: langCheck('102202APP-000041', "pages", json) /* 国际化处理： 区域描述*/,
                dataIndex: 'areadesc',
                width: '10%',
                render: (text, record) => (
                    <EditableCell value={text} onChange={this.onCellChange(record.key, 'areadesc')} json={json} />
                )
            },
            {
                title: langCheck('102202APP-000042', "pages", json) /* 国际化处理： 关联区域编码*/,
                dataIndex: 'relationcode',
                width: '13%',
                render: (text, record) => {
                    return (
                        <RelateSelect
                            json={json}
                            num={record.key}
                            data={this.state.dataSource}
                            type='relationcode'
                            value={text}
                            onChange={this.onCellChange(record.key, 'relationcode')}
                        />
                    );
                }
            },
            {
                title: langCheck('102202APP-000043', "pages", json) /* 国际化处理： 设置类*/,
                dataIndex: 'clazz',
                width: '10%',
                render: (text, record) => {
                    return <EditableCell value={text} onChange={this.onCellChange(record.key, 'clazz')} json={json} />;
                }
            },
            {
                title: langCheck('102202APP-000044', "pages", json) /* 国际化处理： 区域状态*/,
                dataIndex: 'areastatus',
                width: '10%',
                render: (text, record) => {
                    return (
                        <RelateSelect
                            json={json}
                            num={record.key}
                            type='areastatus'
                            value={text}
                            onChange={this.onCellChange(record.key, 'areastatus')}
                        />
                    );
                }
            },
            {
                title: langCheck('102202APP-000036', "pages", json) /* 国际化处理： 关联元数据*/,
                dataIndex: 'metaname',
                width: '10%',
                render: (text, record) => {
                    return (
                        <EditableRefer
                            value={record}
                            onChange={this.onCellChange(record.key, 'metaname')}
                            json={json}
                        />
                    );
                }
            },
            {
                title: langCheck('102202APP-000045', "pages", json) /* 国际化处理： 操作*/,
                width: '7%',
                dataIndex: 'operation',
                //fixed: 'right',
                render: (text, record) => {
                    //let _this = this;
                    return this.state.dataSource.length ? (
                        <div className='operationArea'>
                            {record.pk_area ? (
                                <span className='copyBtn'>
                                    <a href='javascript:;' onClick={() => this.copyRow(record)}>
                                        {langCheck('102202APP-000060', "pages", json)}
                                        {/* 国际化处理： 复制*/}
                                    </a>
                                </span>
                            ) : (
                                ''
                            )}
                            <span className='deleteBtn'>
                                <Popconfirm
                                    title={langCheck('102202APP-000046', "pages", json)} /* 国际化处理： 确定删除?*/
                                    cancelText={langCheck('102202APP-000022', "pages", json)} /* 国际化处理： 取消*/
                                    okText={langCheck('102202APP-000021', "pages", json)} /* 国际化处理： 确定*/
                                    onConfirm={() => this.onDelete(record.key)}
                                >
                                    <a>{langCheck('102202APP-000061', "pages", json)}</a>
                                    {/* 国际化处理： 删除*/}
                                </Popconfirm>
                            </span>
                        </div>
                    ) : null;
                }
            }
        ];
        return (
            <div className='zoneTable-container'>
                <p className='table-button-title'>
                    <Button className='editable-add-btn' onClick={this.handleAdd}>
                        {langCheck('102202APP-000054', "pages", json)}
                        {/* 国际化处理： 新增*/}
                    </Button>
                    {this.props.templetid && (
                        <Button className='editable-clean-btn' onClick={this.showModal}>
                            {langCheck('102202APP-000055', "pages", json)}
                            {/* 国际化处理： 修复错误数据*/}
                        </Button>
                    )}
                    <span className='info'>
                        <i className='iconfont icon-tixing' />
                        {langCheck('102202APP-000056', "pages", json)}
                        {/* 国际化处理： 请拖拽进行排序*/}
                    </span>
                </p>
                <Table
                    bordered
                    dataSource={dataSource.map((item, index) => {
                        item.position = index + 1;
                        return item;
                    })}
                    columns={columns}
                    pagination={false}
                    className='setTemplateTable'
                    components={this.components}
                    onRow={(record, index) => ({
                        index,
                        moveRow: this.moveRow
                    })}
                />
                {previewPrintVisible && (
                    <Modal
                        title={langCheck('102202APP-000057', "pages", json)} /* 国际化处理： 修复错误数据结果*/
                        okText={langCheck('102202APP-000021', "pages", json)} /* 国际化处理： 确定*/
                        cancelText={langCheck('102202APP-000022', "pages", json)} /* 国际化处理： 取消*/
                        visible={previewPrintVisible}
                        onCancel={this.hideModal}
                        maskClosable={false}
                        footer={null}
                    >
                        <div className='printContent' />
                    </Modal>
                )}
                <Modal
                    closable={false}
                    title={langCheck('102202APP-000058', "pages", json)} /* 国际化处理： 表格区域复制*/
                    okText={langCheck('102202APP-000021', "pages", json)} /* 国际化处理： 确定*/
                    cancelText={langCheck('102202APP-000022', "pages", json)} /* 国际化处理： 取消*/
                    mask={false}
                    wrapClassName='vertical-center-modal template-code-add'
                    visible={visible}
                    onOk={this.handleOk}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                >
                    <div className='areaCode-item'>
                        <label htmlFor=''>{langCheck('102202APP-000038', "pages", json)}</label>
                        {/* 国际化处理： 区域编码*/}
                        <Input
                            placeholder={langCheck('102202APP-000038', "pages", json)} /* 国际化处理： 区域编码*/
                            value={areaCode}
                            id='areaCode'
                            onBlur={this.checkCode}
                            onChange={(e) => {
                                const areaCode = e.target.value;
                                this.setState({
                                    areaCode
                                });
                            }}
                        />
                        <p className='areaCode-errorMsg'>{codeErrorMsg}</p>
                    </div>
                    <div className='areaName-item'>
                        <label htmlFor=''>{langCheck('102202APP-000039', "pages", json)}</label>
                        {/* 国际化处理： 区域名称*/}
                        <Input
                            placeholder={langCheck('102202APP-000039', "pages", json)} /* 国际化处理： 区域名称*/
                            value={areaName}
                            id='areaName'
                            onBlur={this.checkName}
                            onChange={(e) => {
                                const areaName = e.target.value;
                                this.setState({
                                    areaName
                                });
                            }}
                        />
                        <p className='areaName-errorMsg'>{nameErrorMsg}</p>
                    </div>
                    <div className='areaPk-item'>
                        <label htmlFor=''>{langCheck('102202APP-000059', "pages", json)}</label>
                        {/* 国际化处理： 区域主键*/}
                        <span>{areaPk ? areaPk : ''}</span>
                    </div>
                </Modal>
            </div>
        );
    }
}
let DragFromeTable = withDragDropContext(ZoneTable);
export default connect(
    (state) => {
        return {
            templetid: state.zoneRegisterData.templetid,
            zoneDatas: state.zoneRegisterData.zoneDatas,
            json: state.zoneRegisterData.json
        };
    },
    { setNewList }
)(DragFromeTable);

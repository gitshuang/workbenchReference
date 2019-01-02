import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Input, Checkbox, InputNumber, Select } from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import Ajax from 'Pub/js/ajax';
import * as utilService from './utilService';
import { showType, returnType, dataTypeObj, colorObj } from './utilService';
import { updateSelectCard, updateAreaList } from 'Store/ZoneSetting/action';
import MoneyModal from './moneyModal';
import ReferModal from './referModal';
import CustomModal from './customModal';
import RelateMetaModal from './relateMetaModal';
import DefaultValueModal from './defaultValueModal';
import * as platform from 'nc-lightapp-front';
import { langCheck, langZoneSetting } from 'Pub/js/utils';
const { high } = platform;
const { Refer, FormulaEditor } = high;
const Search = Input.Search;
//右边栏属性配置组件类
class MyRightSider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moneyModalVisibel: false,
            referModalVisibel: false,
            relateMetaModalVisibel: false,
            customModalVisibel: false,
            defaultValueModalVisibel: false,
            showformula: false,
            editformula: false,
            validateformula: false
        };
    }

    componentDidMount() {
        //把nc-lightapp-front暴露给全局，供全局使用（艺轩）
        window['nc-lightapp-front'] = platform;
    }
    /**
     * input数据变化，更新redux中selectCard对象
     * @param {String} value 设置的value值
     * @param {String} propertyKey 属性主键
     */
    changeValue = (value, propertyKey) => {
        let { selectCard } = this.props;
        if (_.isEmpty(selectCard)) {
            return;
        }
        selectCard = { ...selectCard };
        selectCard[propertyKey] = value;
        this.props.updateSelectCard(selectCard);
    };
    /**
     * input数据变化，更新redux中selectCard对象
     * @param {String} value 设置的value值
     * @param {String} propertyKey 属性主键
     */
    changeCheckboxValue = (value, property) => {
        let { selectCard } = this.props;
        if (_.isEmpty(selectCard)) {
            return;
        }
        selectCard = { ...selectCard };
        selectCard[property] = value;
        //如果设置的属性为visible，需要联动设置visibleposition属性
        if (property === 'visible') {
            selectCard.visibleposition = '';
        }
        this.asyncUpdataCardAndAreaList(selectCard, property);
    };
    //通过selectCard更新areaList对象
    updateCardInArea = () => {
        let { areaList, selectCard } = this.props;
        if (_.isEmpty(selectCard)) {
            return;
        }
        let targetAreaIndex = 0;
        let targetCardIndex = 0;
        areaList = _.cloneDeep(areaList);
        //遍历arealist，找到selectCard所在的区域
        _.forEach(areaList, (a, i) => {
            _.forEach(a.queryPropertyList, (q, index) => {
                if (
                    q.areaid === selectCard.areaid &&
                    q.pk_query_property === selectCard.pk_query_property
                ) {
                    targetAreaIndex = i;
                    targetCardIndex = index;
                    return false;
                }
            });
        });
        areaList[targetAreaIndex].queryPropertyList[
            targetCardIndex
        ] = selectCard;
        this.props.updateAreaList(areaList);
    };
    /**
     * 通过selectCard获取当前区域的所有卡片
     * @param {Array} queryPropertyList 当前区域的所有卡片
     */
    getCardListInAreaBySelectCard = () => {
        let { areaList, selectCard } = this.props;
        let targetAreaIndex = 0;
        _.forEach(areaList, (a, i) => {
            if (a.pk_area === selectCard.areaid) {
                targetAreaIndex = i;
                return false;
            }
        });
        return areaList[targetAreaIndex].queryPropertyList;
    };
    //按回车键，input失去焦点
    onPressEnter = (value, property) => {
        this[`${property}input`].blur();
    };
    /**
     * 获得一个数字输入框组件
     * @param {String} placeholder 文本显示值
     * @param {String} property 属性主键
     * @return {} 数字输入框组件
     */
    getMyNumberInput = (placeholder, property) => {
        return (
            <InputNumber
                min={1}
                value={this.props.selectCard[property]}
                onChange={value => {
                    this.changeValue(value, property);
                }}
                onBlur={e => {
                    this.updateCardInArea();
                }}
                ref={input => (this[`${property}input`] = input)}
                onPressEnter={e => {
                    this.onPressEnter(e.target.value, property);
                }}
            />
        );
    };
    /**
     * 获得一个文本输入框组件
     * @param {String} placeholder 文本显示值
     * @param {String} property 属性主键
     * @return {} 文本输入框组件
     */
    getMyInput(placeholder, property, notMeteData) {
        //如果组件长度为null或者''时设置默认显示值为120
        if (property == 'width') {
            if (this.props.selectCard[property] == null || this.props.selectCard[property] == '') {
                this.props.selectCard[property] = 120;
            }
        }
        //metapath为空并且是编码
        if ((notMeteData == '' || notMeteData == null) && property == 'code') {
            return (
                <Input
                    style={{ height: 23, width: 176 }}
                    placeholder={placeholder}
                    value={this.props.selectCard[property]}
                    onChange={e => {
                        this.changeValue(e.target.value, property);
                    }}
                    onBlur={e => {
                        this.updateCardInArea();
                    }}
                    ref={input => (this[`${property}input`] = input)}
                    onPressEnter={e => {
                        this.onPressEnter(e.target.value, property);
                    }}
                />
            );
        }else {
            //不是编码
            if (property != 'code') {
                return (
                    <Input
                        style={{ height: 23, width: 176 }}
                        placeholder={placeholder}
                        value={this.props.selectCard[property]}
                        onChange={e => {
                            this.changeValue(e.target.value, property);
                        }}
                        onBlur={e => {
                            this.updateCardInArea();
                        }}
                        ref={input => (this[`${property}input`] = input)}
                        onPressEnter={e => {
                            this.onPressEnter(e.target.value, property);
                        }}
                    />
                );
            }else {//metapath不为空或者null 是编码
                return (
                    <Input
                        disabled='disabled'
                        style={{ height: 23, width: 176 }}
                        placeholder={placeholder}
                        value={this.props.selectCard[property]}
                        onChange={e => {
                            this.changeValue(e.target.value, property);
                        }}
                        onBlur={e => {
                            this.updateCardInArea();
                        }}
                        ref={input => (this[`${property}input`] = input)}
                        onPressEnter={e => {
                            this.onPressEnter(e.target.value, property);
                        }}
                    />
                );
            }
        }
    }
    /**
     * 获得一个checkbox组件
     * @param {String} property 属性主键
     * @return {} checkbox组件
     */
    getMyCheckbox = property => {
        return (
            <Checkbox
                checked={Boolean(this.props.selectCard[property])}
                onChange={e => {
                    this.changeCheckboxValue(e.target.checked, property);
                }}
            />
        );
    };
    //原用做下拉选择的事件处理,现用来先更新selectCard后更新areaList
    handleSelectChange = (value, property) => {
        let { selectCard } = this.props;
        if (_.isEmpty(selectCard)) {
            return;
        }
        selectCard = { ...selectCard };
        selectCard[property] = value;
        //进行业务相关的联动处理
        if (property === 'datatype') {
            selectCard.dataval = '';
            selectCard.itemtype = utilService.getItemtypeByDatatype(
                selectCard.datatype
            );
            //小数或者金额
            if (value === '31' || value === '52') {
                selectCard.dataval = '2,,';
            }
        }
        this.asyncUpdataCardAndAreaList(selectCard, property);
    };
    //异步更新selectCard后更新areaList
    async asyncUpdataCardAndAreaList(selectCard, property) {
        await this.props.updateSelectCard(selectCard);
        await this.updateCardInArea();
    }
    //获取下拉选择Dom
    getMySelect = (mySelectObj, property) => {
        // console.log(window.multiZoneSettingLang);
        return (
            <Select
                value={
                    _.isEmpty(this.props.selectCard[property])
                        ? mySelectObj[0].value
                        : this.props.selectCard[property]
                }
                onChange={value => {
                    this.handleSelectChange(value, property);
                }}
                style={{ width: 176 }}
                size={'small'}
                // getPopupContainer={() => document.getElementById('fixSelect')}
            >
                {(() => {
                    if (property === 'color') {
                        return mySelectObj.map((c, index) => {
                            return (
                                <Option key={index} value={c.value}>
                                    <span className="template-setting-color-select">
                                        <span>{c.name}</span>
                                        <span
                                            className="color-select-color"
                                            style={{ backgroundColor: c.value }}
                                        />
                                    </span>
                                </Option>
                            );
                        });
                    } else {
                        return mySelectObj.map((c, index) => {
                            return (
                                <Option key={index} value={c.value}>
                                    {c.name}
                                </Option>
                            );
                        });
                    }
                })()}
            </Select>
        );
    };
    //判断是否为元数据
    getMetaType = selectCard => {
        if (!!selectCard.metapath) return true; // 是元数据
        return false; // 不是元数据 默认没选的情况是false
    };
    // 获取当前区域的类型
    getAreaType = (areaList, selectCard) => {
        let result;
        _.forEach(areaList, (val, index) => {
            _.forEach(val.queryPropertyList, (v, i) => {
                if (selectCard.areaid === v.areaid) {
                    result = val.areatype;
                    return;
                }
            });
        });
        return result;
    };
    // 获取当前区域
    getArea = (areaList, selectCard) => {
        let result;
        _.forEach(areaList, (val, index) => {
            _.forEach(val.queryPropertyList, (v, i) => {
                if (selectCard.areaid === v.areaid) {
                    result = val;
                    return;
                }
            });
        });
        return result;
    };
    // 设置不同弹框的显示和隐藏
    setModalVisibel = (whichModalVisibel, val) => {
        this.setState({ [whichModalVisibel]: val });
    };
    //获得普通的search框组件
    getMySearch = (key, whichModalVisibel) => {
        const { selectCard } = this.props;
        return (
            <Search
                size="small"
                style={{ width: 176 }}
                value={selectCard[key]}
                onChange={() => {}}
                onSearch={() => {
                    this.setState({ [whichModalVisibel]: true });
                }}
            />
        );
    };
    //获得公式的search框组件
    getMyFormulaSearch = key => {
        const { selectCard } = this.props;
        return (
            <Search
                size="small"
                style={{ width: 176 }}
                value={selectCard[key]}
                onChange={() => {}}
                onSearch={() => {
                    //this.refs[key].setShow(true);
                    this.handleFormula();
                    this.setState({ [key]: true });
                    //	this.refs[key].handleTextAreaChange(selectCard[key]);
                }}
            />
        );
    };
    //查询区，元数据属性
    getDom1 = () => {
        const { selectCard, json } = this.props;
        console.log('selectCard--', selectCard);
        let meteDate = selectCard.metapath;//区分元数据和非元数据
        // console.log('meteDate--', meteDate);
        return (
            <Tabs defaultActiveKey="1" >
                <TabPane tab={langCheck('ZoneSetting-000075', 'pages', json)} key="1">
                {/* /* 国际化处理： 显示属性*/}
                    <ul className="basic-property">
                        <li>{langCheck('ZoneSetting-000076', 'pages', json)}</li>
                        {/* /* 国际化处理： 显示名称*/}
                        <li>{this.getMyInput(langCheck('ZoneSetting-000076', 'pages', json), 'label')}</li>
                        {/* /* 国际化处理： 显示名称*/ }
                        <li>{langCheck('ZoneSetting-000077', 'pages', json)}</li>
                        {/* /* 国际化处理： 多语字段*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000077', 'pages', json), 'resid')}</li>
                        {/* /* 国际化处理： 多语字段*/}
                        <li>{langCheck('ZoneSetting-000078', 'pages', json)}</li>
                        {/* /* 国际化处理： 数据类型*/ }
                        {/* 元数据，禁止设置datatype属性，除了56自定义项*/}
                        {(() => {
                            if (selectCard.isdefined) {
                                //通过isdefined判断是否为自定义项，可以选择数据类型
                                return (
                                    <li>
                                        {this.getMySelect(
                                            dataTypeObj(),
                                            'datatype'
                                        )}
                                    </li>
                                );
                            } else {
                                let showDataTypeName = utilService.getObjNameByDatatype(
                                    selectCard.datatype,
                                    dataTypeObj()
                                );
                                showDataTypeName =
                                    showDataTypeName === ''
                                        ? selectCard.datatype
                                        : showDataTypeName;
                                return <li>{showDataTypeName}</li>;
                            }
                        })()}
                        
                        {
                            (()=> {
                                return (
                                    <li>{langCheck('ZoneSetting-000022', 'pages', json)}</li>
                                );
                            })()
                        }
                        {/* /* 国际化处理： 类型设置*/ }
                        {
                            (()=> {
                                if (selectCard.datatype == '203' || selectCard.datatype == '32') {//203为枚举,32逻辑
                                    return (
                                        <li>{this.getMyInput(langCheck('ZoneSetting-000022', 'pages', json), 'showdataval')}</li>
                                    );
                                } else {
                                    return (<li>{this.getMyInput(langCheck('ZoneSetting-000022', 'pages', json), 'dataval')}</li>
                                    );}
                            })()
                        }

                        {/* 枚举隐藏项 */}
                        {
                            (()=> {
                                if (selectCard.datatype == '203' || selectCard.datatype == '32') {//203为枚举,32逻辑
                                    return (
                                        <li style={{display: 'none'}}>{langCheck('ZoneSetting-000022', 'pages', json)}</li>
                                    );
                                }
                            })()
                        }
                        {/* /* 国际化处理： 类型设置*/ }
                        {
                            (()=> {
                                if (selectCard.datatype == '203' || selectCard.datatype == '32') {//203为枚举,32逻辑
                                    return (<li style={{display: 'none'}}>{this.getMyInput(langCheck('ZoneSetting-000022', 'pages', json), 'dataval')}</li>);
                                }
                            })()
                        }
                        {/* /* 国际化处理： 类型设置*/}
                        
                        <li>{langCheck('ZoneSetting-000032', 'pages', json)}</li>
                        {/* /* 国际化处理： 最大长度*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000032', 'pages', json), 'maxlength')}</li>
                        {/* /* 国际化处理： 最大长度*/ }
                        <li>{langCheck('ZoneSetting-000079', 'pages', json)}</li>
                        {/* /* 国际化处理： 非元数据条件*/ }
                        <li>{this.getMyCheckbox('isnotmeta')}</li>
                        <li>{langCheck('ZoneSetting-000080', 'pages', json)}</li>
                        {/* /* 国际化处理： 使用*/}
                        <li>{this.getMyCheckbox('isuse')}</li>
                        <li>{langCheck('ZoneSetting-000081', 'pages', json)}</li>
                        {/* /* 国际化处理： 编码*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000081', 'pages', json), 'code', meteDate)}</li>
                        {/* /* 国际化处理： 编码*/ }
                        <li>{langCheck('ZoneSetting-000082', 'pages', json)}</li>
                        {/* /* 国际化处理： 操作符编码*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000082', 'pages', json), 'opersign')}</li>
                        {/* /* 国际化处理： 操作符编码*/ }
                        <li>{langCheck('ZoneSetting-000083', 'pages', json)}</li>
                        {/* /* 国际化处理： 操作符名称*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000083', 'pages', json), 'opersignname')}</li>
                        {/* /* 国际化处理： 操作符名称*/ }
                        <li>{langCheck('ZoneSetting-000084', 'pages', json)}</li>
                        {/* /* 国际化处理： 默认取值*/ }
                        {(() => {
                            if (
                                selectCard.datatype === '204' &&
                                selectCard.refname !== '-99'
                            ) {
                                return (
                                    <li>
                                        {this.getMySearch(
                                            'defaultvalue',
                                            'defaultValueModalVisibel'
                                        )}
                                        <DefaultValueModal
                                            areatype="0"
                                            refcode={selectCard.refcode}
                                            refname={selectCard.refname}
                                            isMultiSelectedEnabled={Boolean(
                                                selectCard.ismultiselectedenabled
                                            )}
                                            handleSelectChange={
                                                this.handleSelectChange
                                            }
                                            defaultvalue={
                                                selectCard.defaultvalue
                                            }
                                            modalVisibel={
                                                this.state
                                                    .defaultValueModalVisibel
                                            }
                                            setModalVisibel={
                                                this.setModalVisibel
                                            }
                                        />
                                    </li>
                                );
                            } else {
                                return (
                                    <li>
                                        {this.getMyInput(
                                            langCheck('ZoneSetting-000084', 'pages', json),/* 国际化处理： 默认取值*/
                                            'defaultvalue'
                                        )}
                                    </li>
                                );
                            }
                        })()}
                        <li>{langCheck('ZoneSetting-000085', 'pages', json)}</li>
                        {/* /* 国际化处理： 不可修改*/ }
                        <li>{this.getMyCheckbox('disabled')}</li>
                        <li>{langCheck('ZoneSetting-000086', 'pages', json)}</li>
                        {/* /* 国际化处理： 默认显示*/ }
                        <li>{this.getMyCheckbox('visible')}</li>
                        {/* 如果默认显示为true才显示*/}
                        {(() => {
                            if (selectCard.visible) {
                                return [
                                    <li key="visibleposition0">
                                        {langCheck('ZoneSetting-000087', 'pages', json)}
                                        {/* /* 国际化处理： 默认显示字段排序*/ }
                                    </li>,
                                    <li key="visibleposition1">
                                        {this.getMyInput(
                                            langCheck('ZoneSetting-000087', 'pages', json),/* 国际化处理： 默认显示字段排序*/
                                            'visibleposition'
                                        )}
                                    </li>
                                ];
                            }
                        })()}
                        <li>{langCheck('ZoneSetting-000088', 'pages', json)}</li>
                        {/* /* 国际化处理： 多选*/ }
                        <li>{this.getMyCheckbox('ismultiselectedenabled')}</li>
                        <li>{langCheck('ZoneSetting-000089', 'pages', json)}</li>
                        {/* /* 国际化处理： 固定条件*/ }
                        <li>{this.getMyCheckbox('isfixedcondition')}</li>
                        <li>{langCheck('ZoneSetting-000090', 'pages', json)}</li>
                        {/* /* 国际化处理： 必输条件*/ }
                        <li>{this.getMyCheckbox('required')}</li>
                        <li>{langCheck('ZoneSetting-000091', 'pages', json)}</li>
                        {/* /* 国际化处理： 查询条件*/ }
                        <li>{this.getMyCheckbox('isquerycondition')}</li>
                        <li>{langCheck('ZoneSetting-000030', 'pages', json)}</li>
                        {/* /* 国际化处理： 参照名称*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000030', 'pages', json), 'refname')}</li>
                        {/* /* 国际化处理： 参照名称*/ }
                        <li>{langCheck('ZoneSetting-000092', 'pages', json)}</li>
                        {/* /* 国际化处理： 参照包含下级*/ }
                        <li>{this.getMyCheckbox('containlower')}</li>
                        <li>{langCheck('ZoneSetting-000093', 'pages', json)}</li>
                        {/* /* 国际化处理： 参照自动检查*/ }
                        <li>{this.getMyCheckbox('ischeck')}</li>
                        <li>{langCheck('ZoneSetting-000094', 'pages', json)}</li>
                        {/* /* 国际化处理： 参照跨集团*/ }
                        <li>{this.getMyCheckbox('isbeyondorg')}</li>
                        <li>{langCheck('ZoneSetting-000095', 'pages', json)}</li>
                        {/* /* 国际化处理： 使用系统函数*/ }
                        <li>{this.getMyCheckbox('usefunc')}</li>
                        <li>{langCheck('ZoneSetting-000096', 'pages', json)}</li>
                        {/* /* 国际化处理： 表编码*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000096', 'pages', json), 'tablecode')}</li>
                        {/* /* 国际化处理： 表编码*/ }
                        <li>{langCheck('ZoneSetting-000097', 'pages', json)}</li>
                        {/* /* 国际化处理： 表名称*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000097', 'pages', json), 'querytablename')}</li>
                        {/* /* 国际化处理： 表名称*/ }
                        <li>{langCheck('ZoneSetting-000098', 'pages', json)}</li>
                        {/* /* 国际化处理： 组件类型*/ }
                        <li>
                            {this.getMySelect(
                                utilService.getItemtypeObjByDatatype(
                                    selectCard.datatype
                                ),
                                'itemtype'
                            )}
                        </li>
                        <li>{langCheck('ZoneSetting-000099', 'pages', json)}</li>
                        {/* /* 国际化处理： 显示类型*/}
                        <li>
                            {this.getMySelect(showType(), 'showtype')}
                        </li>
                        <li>{langCheck('ZoneSetting-000100', 'pages', json)}</li>
                        {/* /* 国际化处理： 返回类型*/ }
                        <li>
                            {this.getMySelect(
                                returnType(),
                                'returntype'
                            )}
                        </li>
                        <li>{langCheck('ZoneSetting-000101', 'pages', json)}</li>
                        {/* /* 国际化处理： 自定义1*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000101', 'pages', json), 'define1')}</li>
                        {/* /* 国际化处理： 自定义1*/ }
                        <li>{langCheck('ZoneSetting-000102', 'pages', json)}</li>
                        {/* /* 国际化处理： 自定义2*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000102', 'pages', json), 'define2')}</li>
                        {/* /* 国际化处理： 自定义2*/ }
                        <li>{langCheck('ZoneSetting-000103', 'pages', json)}</li>
                        {/* /* 国际化处理： 自定义3*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000103', 'pages', json), 'define3')}</li>
                        {/* /* 国际化处理： 自定义3*/ }
                        <li>{langCheck('ZoneSetting-000104', 'pages', json)}</li>
                        {/* /* 国际化处理： 自定义4*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000104', 'pages', json), 'define4')}</li>
                        {/* /* 国际化处理： 自定义4*/ }
                        <li>{langCheck('ZoneSetting-000105', 'pages', json)}</li>
                        {/* /* 国际化处理： 自定义5*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000105', 'pages', json), 'define5')}</li>
                        {/* /* 国际化处理： 自定义5*/ }
                    </ul>
                </TabPane>
            </Tabs>
        );
    };
    //查询区，非元数据属性
    getDom2 = () => {
        const { selectCard, json } = this.props;
        let meteDate = selectCard.metapath;//区分元数据和非元数据
        // console.log('meteDate=', meteDate);
        console.log('selectCard=', selectCard);
        return (
            <Tabs defaultActiveKey="1" >
                <TabPane tab={langCheck('ZoneSetting-000075', 'pages', json)} key="1">
                {/* /* 国际化处理： 显示属性*/ }
                    <ul className="basic-property">
                        <li>{langCheck('ZoneSetting-000076', 'pages', json)}</li>
                        {/* /* 国际化处理： 显示名称*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000076', 'pages', json), 'label')}</li>
                        {/* /* 国际化处理： 显示名称*/ }
                        <li>{langCheck('ZoneSetting-000077', 'pages', json)}</li>
                        {/* /* 国际化处理： 多语字段*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000077', 'pages', json), 'resid')}</li>
                        {/* /* 国际化处理： 多语字段*/ }
                        <li>{langCheck('ZoneSetting-000079', 'pages', json)}</li>
                        {/* /* 国际化处理： 非元数据条件*/ }
                        <li>{this.getMyCheckbox('isnotmeta')}</li>
                        <li>{langCheck('ZoneSetting-000080', 'pages', json)}</li>
                        {/* /* 国际化处理： 使用*/ }
                        <li>{this.getMyCheckbox('isuse')}</li>
                        <li>{langCheck('ZoneSetting-000106', 'pages', json)}</li>
                        {/* /* 国际化处理： 元数据属性*/ }
                        <li>
                            {this.getMyInput(langCheck('ZoneSetting-000106', 'pages', json), 'metadataproperty')}
                            {/* /* 国际化处理： 元数据属性*/ }
                        </li>
                        <li>{langCheck('ZoneSetting-000032', 'pages', json)}</li>
                        {/* /* 国际化处理： 最大长度*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000032', 'pages', json), 'maxlength')}</li>
                        {/* /* 国际化处理： 最大长度*/ }
                        <li>{langCheck('ZoneSetting-000081', 'pages', json)}</li>
                        {/* /* 国际化处理： 编码*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000081', 'pages', json), 'code', meteDate)}</li>
                        {/* /* 国际化处理： 编码*/ }
                        <li>{langCheck('ZoneSetting-000082', 'pages', json)}</li>
                        {/* /* 国际化处理： 操作符编码*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000082', 'pages', json), 'opersign')}</li>
                        {/* /* 国际化处理： 操作符编码*/ }
                        <li>{langCheck('ZoneSetting-000083', 'pages', json)}</li>
                        {/* /* 国际化处理： 操作符名称*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000083', 'pages', json), 'opersignname')}</li>
                        {/* /* 国际化处理： 操作符名称*/ }
                        <li>{langCheck('ZoneSetting-000084', 'pages', json)}</li>
                        {/* /* 国际化处理： 默认取值*/ }
                        {(() => {
                            if (
                                selectCard.datatype === '204' &&
                                selectCard.refname !== '-99'
                            ) {
                                return (
                                    <li>
                                        {this.getMySearch(
                                            'defaultvalue',
                                            'defaultValueModalVisibel'
                                        )}
                                        <DefaultValueModal
                                            areatype="0"
                                            refcode={selectCard.refcode}
                                            refname={selectCard.refname}
                                            isMultiSelectedEnabled={Boolean(
                                                selectCard.ismultiselectedenabled
                                            )}
                                            handleSelectChange={
                                                this.handleSelectChange
                                            }
                                            defaultvalue={
                                                selectCard.defaultvalue
                                            }
                                            modalVisibel={
                                                this.state
                                                    .defaultValueModalVisibel
                                            }
                                            setModalVisibel={
                                                this.setModalVisibel
                                            }
                                        />
                                    </li>
                                );
                            } else {
                                return (
                                    <li>
                                        {this.getMyInput(
                                            langCheck('ZoneSetting-000084', 'pages', json),/* 国际化处理： 默认取值*/
                                            'defaultvalue'
                                        )}
                                    </li>
                                );
                            }
                        })()}
                        <li>{langCheck('ZoneSetting-000085', 'pages', json)}</li>
                        {/* /* 国际化处理： 不可修改*/ }
                        <li>{this.getMyCheckbox('disabled')}</li>
                        <li>{langCheck('ZoneSetting-000086', 'pages', json)}</li>
                        {/* /* 国际化处理： 默认显示*/ }
                        <li>{this.getMyCheckbox('visible')}</li>
                        {/* 如果默认显示为true才显示*/}
                        {(() => {
                            if (selectCard.visible) {
                                return [
                                    <li key="visibleposition0">
                                        {langCheck('ZoneSetting-000087', 'pages', json)}
                                        {/* /* 国际化处理： 默认显示字段排序*/ }
                                    </li>,
                                    <li key="visibleposition1">
                                        {this.getMyInput(
                                            langCheck('ZoneSetting-000087', 'pages', json),/* 国际化处理： 默认显示字段排序*/
                                            'visibleposition'
                                        )}
                                    </li>
                                ];
                            }
                        })()}
                        <li>{langCheck('ZoneSetting-000088', 'pages', json)}</li>
                        {/* /* 国际化处理： 多选*/ }
                        <li>{this.getMyCheckbox('ismultiselectedenabled')}</li>
                        <li>{langCheck('ZoneSetting-000089', 'pages', json)}</li>
                        {/* /* 国际化处理： 固定条件*/ }
                        <li>{this.getMyCheckbox('isfixedcondition')}</li>
                        <li>{langCheck('ZoneSetting-000090', 'pages', json)}</li>
                        {/* /* 国际化处理： 必输条件*/ }
                        <li>{this.getMyCheckbox('required')}</li>
                        <li>{langCheck('ZoneSetting-000091', 'pages', json)}</li>
                        {/* /* 国际化处理： 查询条件*/ }
                        <li>{this.getMyCheckbox('isquerycondition')}</li>
                        <li>{langCheck('ZoneSetting-000030', 'pages', json)}</li>
                        {/* /* 国际化处理： 参照名称*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000030', 'pages', json), 'refname')}</li>
                        {/* /* 国际化处理： 参照名称*/ }
                        <li>{langCheck('ZoneSetting-000092', 'pages', json)}</li>
                        {/* /* 国际化处理： 参照包含下级*/ }
                        <li>{this.getMyCheckbox('containlower')}</li>
                        <li>{langCheck('ZoneSetting-000093', 'pages', json)}</li>
                        {/* /* 国际化处理： 参照自动检查*/ }
                        <li>{this.getMyCheckbox('ischeck')}</li>
                        <li>{langCheck('ZoneSetting-000094', 'pages', json)}</li>
                        {/* /* 国际化处理： 参照跨集团*/ }
                        <li>{this.getMyCheckbox('isbeyondorg')}</li>
                        <li>{langCheck('ZoneSetting-000095', 'pages', json)}</li>
                        {/* /* 国际化处理： 使用系统函数*/ }
                        <li>{this.getMyCheckbox('usefunc')}</li>
                        <li>{langCheck('ZoneSetting-000096', 'pages', json)}</li>
                        {/* /* 国际化处理： 表编码*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000096', 'pages', json), 'tablecode')}</li>
                        {/* /* 国际化处理： 表编码*/ }
                        <li>{langCheck('ZoneSetting-000097', 'pages', json)}</li>
                        {/* /* 国际化处理： 表名称*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000097', 'pages', json), 'querytablename')}</li>
                        {/* /* 国际化处理： 表名称*/ }
                        <li>{langCheck('ZoneSetting-000099', 'pages', json)}</li>
                        {/* /* 国际化处理： 显示类型*/ }
                        <li>
                            {this.getMySelect(showType(), 'showtype')}
                        </li>
                        <li>{langCheck('ZoneSetting-000100', 'pages', json)}</li>
                        {/* /* 国际化处理： 返回类型*/ }
                        <li>
                            {this.getMySelect(
                                returnType(),
                                'returntype'
                            )}
                        </li>
                    </ul>
                </TabPane>
                <TabPane tab={langCheck('ZoneSetting-000107', 'pages', json)} key="2">
                {/* /* 国际化处理： 高级属性*/ }
                    <ul className="basic-property">
                        <li>{langCheck('ZoneSetting-000078', 'pages', json)}</li>
                        {/* /* 国际化处理： 数据类型*/ }
                        <li>
                            {this.getMySelect(
                                dataTypeObj(),
                                'datatype'
                            )}
                        </li>

                        {
                            (()=> {
                                return (
                                    <li>{langCheck('ZoneSetting-000022', 'pages', json)}</li>
                                );
                            })()
                        }
                        {/* /* 国际化处理： 类型设置*/ }
                        {
                            (()=> {
                                if (selectCard.datatype == '203' || selectCard.datatype == '32') {//203为枚举,32为逻辑
                                    return (
                                        <li>{this.getMyInput(langCheck('ZoneSetting-000022', 'pages', json), 'showdataval')}</li>
                                    );
                                } else {
                                    return(
                                        <li>{this.getMyInput(langCheck('ZoneSetting-000022', 'pages', json), 'dataval')}</li>
                                    );
                                }
                            })()
                        }
                        
                        {/* 枚举隐藏项 */}
                        {
                            (()=> {
                                if (selectCard.datatype == '203' || selectCard.datatype == '32') {//203为枚举,32为逻辑
                                    return (
                                        <li style={{display: 'none'}}>{langCheck('ZoneSetting-000022', 'pages', json)}</li>
                                    );
                                }
                            })()
                        }
                        {/* /* 国际化处理： 类型设置*/ }
                        {
                            (()=> {
                                if (selectCard.datatype == '203' || selectCard.datatype == '32') {//203为枚举,32为逻辑
                                    return (
                                        <li style={{display: 'none'}}>{this.getMyInput(langCheck('ZoneSetting-000022', 'pages', json), 'dataval')}</li>
                                    );
                                }
                            })()
                        }

                        <li>{langCheck('ZoneSetting-000098', 'pages', json)}</li>
                        {/* /* 国际化处理： 组件类型*/}
                        <li>
                            {this.getMySelect(
                                utilService.getItemtypeObjByDatatype(
                                    selectCard.datatype
                                ),
                                'itemtype'
                            )}
                        </li>
                        <li>{langCheck('ZoneSetting-000101', 'pages', json)}</li>
                        {/* /* 国际化处理： 自定义1*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000101', 'pages', json), 'define1')}</li>
                        {/* /* 国际化处理： 自定义1*/ }
                        <li>{langCheck('ZoneSetting-000102', 'pages', json)}</li>
                        {/* /* 国际化处理： 自定义2*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000102', 'pages', json), 'define2')}</li>
                        {/* /* 国际化处理： 自定义2*/ }
                        <li>{langCheck('ZoneSetting-000103', 'pages', json)}</li>
                        {/* /* 国际化处理： 自定义3*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000103', 'pages', json), 'define3')}</li>
                        {/* /* 国际化处理： 自定义3*/ }
                        <li>{langCheck('ZoneSetting-000104', 'pages', json)}</li>
                        {/* /* 国际化处理： 自定义4*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000104', 'pages', json), 'define4')}</li>
                        {/* /* 国际化处理： 自定义4*/ }
                        <li>{langCheck('ZoneSetting-000105', 'pages', json)}</li>
                        {/* /* 国际化处理： 自定义5*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000105', 'pages', json), 'define5')}</li>
                        {/* /* 国际化处理： 自定义5*/ }
                    </ul>
                </TabPane>
            </Tabs>
        );
    };
    //非查询区，元数据属性||非元数据
    getDom3 = (areaType, isMetaData) => {
        const { selectCard, json } = this.props;
        // console.log('selectCard-------', selectCard);
        const isShowRelateMeta =
            selectCard.datatype === '204' ? 'block' : 'none'; //判断是否为参照
        const areaCardList = this.getCardListInAreaBySelectCard();
        let meteDate = selectCard.metapath;//区分元数据和非元数据
        // console.log('meteDate--', meteDate);
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab={langCheck('ZoneSetting-000075', 'pages', json)} key="1">
                {/* /* 国际化处理： 显示属性*/}
                    <ul className="basic-property">
                        <li>{langCheck('ZoneSetting-000076', 'pages', json)}</li>
                        {/* /* 国际化处理： 显示名称*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000076', 'pages', json), 'label')}</li>
                        {/* /* 国际化处理： 显示名称*/ }
                        <li>{langCheck('ZoneSetting-000077', 'pages', json)}</li>
                        {/* /* 国际化处理： 多语字段*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000077', 'pages', json), 'resid')}</li>
                        {/* /* 国际化处理： 多语字段*/ }
                        <li>{langCheck('ZoneSetting-000081', 'pages', json)}</li>
                        {/* /* 国际化处理： 编码*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000081', 'pages', json), 'code', meteDate)}</li>
                        {/* /* 国际化处理： 编码*/ }
                        {(() => {
                            if (!isMetaData) {
                                return [
                                    <li key="metadataproperty0">{langCheck('ZoneSetting-000106', 'pages', json)}</li>,/* 国际化处理： 元数据属性*/
                                    <li key="metadataproperty1">
                                        {this.getMyInput(
                                            langCheck('ZoneSetting-000106', 'pages', json),/* 国际化处理： 元数据属性*/
                                            'metadataproperty'
                                        )}
                                    </li>
                                ];
                            }
                        })()}
                        {(() => {
                            if (areaType === '1') {
                                //表单
                                return [
                                    <li key="colnum0">{langCheck('ZoneSetting-000031', 'pages', json)}</li>,/* 国际化处理： 占用列数*/
                                    <li key="colnum1">
                                        {this.getMyInput(langCheck('ZoneSetting-000031', 'pages', json), 'colnum')}
                                        {/* /* 国际化处理： 占用列数*/ }
                                    </li>
                                ];
                            } else {
                                return [
                                    <li key="width0">{langCheck('ZoneSetting-000108', 'pages', json)}</li>,/* 国际化处理： 组件长度*/
                                    <li key="width1">
                                        {this.getMyInput(langCheck('ZoneSetting-000108', 'pages', json), 'width')}
                                        {/* /* 国际化处理： 组件长度*/ }
                                    </li>
                                ];
                            }
                        })()}
                        <li>{langCheck('ZoneSetting-000032', 'pages', json)}</li>
                        {/* /* 国际化处理： 最大长度*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000032', 'pages', json), 'maxlength')}</li>
                        {/* /* 国际化处理： 最大长度*/ }
                        <li>{langCheck('ZoneSetting-000109', 'pages', json)}</li>
                        {/* /* 国际化处理： 可修订*/ }
                        <li>{this.getMyCheckbox('isrevise')}</li>
                        {(() => {
                            if (areaType === '1') {
                                //表单
                                return [
                                    <li key="nextrow0">{langCheck('ZoneSetting-000110', 'pages', json)}</li>,/* 国际化处理： 另起一行*/
                                    <li key="nextrow1">
                                        {this.getMyCheckbox('isnextrow')}
                                    </li>
                                ];
                            } else {
                                return [
                                    <li key="istotal0">{langCheck('ZoneSetting-000111', 'pages', json)}</li>,/* 国际化处理： 合计*/
                                    <li key="istotal1">
                                        {this.getMyCheckbox('istotal')}
                                    </li>
                                ];
                            }
                        })()}
                        <li>{langCheck('ZoneSetting-000112', 'pages', json)}</li>
                        {/* /* 国际化处理： 可见*/ }
                        <li>{this.getMyCheckbox('visible')}</li>
                        <li>{langCheck('ZoneSetting-000113', 'pages', json)}</li>
                        {/* /* 国际化处理： 必输项*/ }
                        <li>{this.getMyCheckbox('required')}</li>
                        <li>{langCheck('ZoneSetting-000085', 'pages', json)}</li>
                        {/* /* 国际化处理： 不可修改*/ }
                        <li>{this.getMyCheckbox('disabled')}</li>
                        <li>{langCheck('ZoneSetting-000084', 'pages', json)}</li>
                        {/* /* 国际化处理： 默认取值*/ }
                        {(() => {
                            if (
                                selectCard.datatype === '204' &&
                                !_.isUndefined(selectCard.refcode) &&
                                selectCard.refcode !== '' &&
                                selectCard.refcode !== null
                            ) {
                                //参照
                                return (
                                    <li>
                                        {this.getMySearch(
                                            'defaultvalue',
                                            'defaultValueModalVisibel'
                                        )}
                                        <DefaultValueModal
                                            refcode={selectCard.refcode}
                                            refname={selectCard.refname}//非查询区refname
                                            isMultiSelectedEnabled={Boolean(
                                                selectCard.ismultiselectedenabled
                                            )}
                                            handleSelectChange={
                                                this.handleSelectChange
                                            }
                                            defaultvalue={
                                                selectCard.defaultvalue
                                            }
                                            modalVisibel={
                                                this.state
                                                    .defaultValueModalVisibel
                                            }
                                            setModalVisibel={
                                                this.setModalVisibel
                                            }
                                        />
                                    </li>
                                );
                            } else {
                                return (
                                    <li>
                                        {this.getMyInput(
                                            langCheck('ZoneSetting-000084', 'pages', json),/* 国际化处理： 默认取值*/
                                            'defaultvalue'
                                        )}
                                    </li>
                                );
                            }
                        })()}
                        <li>{langCheck('ZoneSetting-000114', 'pages', json)}</li>
                        {/* /* 国际化处理： 默认系统变量*/ }
                        <li>
                            {this.getMySelect(
                                utilService.defaultvarObj,
                                'defaultvar'
                            )}
                        </li>
                        <li>{langCheck('ZoneSetting-000115', 'pages', json)}</li>
                        {/* /* 国际化处理： 显示颜色*/ }
                        <li>
                            {this.getMySelect(colorObj(), 'color')}
                        </li>
                    </ul>
                </TabPane>
                <TabPane tab={langCheck('ZoneSetting-000107', 'pages', json)} key="2">
                {/* /* 国际化处理： 高级属性*/ }
                    <ul className="basic-property">
                        <li>{langCheck('ZoneSetting-000078', 'pages', json)}</li>
                        {/* /* 国际化处理： 数据类型*/ }
                        {/* 元数据，禁止设置datatype属性，除了56自定义项*/}
                        {(() => {
                            if (isMetaData) {
                                if (selectCard.isdefined) {
                                    //通过isdefined判断是否为自定义项，可以选择数据类型
                                    return (
                                        <li>
                                            {this.getMySelect(
                                                dataTypeObj(),
                                                'datatype'
                                            )}
                                        </li>
                                    );
                                } else {
                                    let showDataTypeName = utilService.getObjNameByDatatype(
                                        selectCard.datatype,
                                        dataTypeObj()
                                    );
                                    showDataTypeName =
                                        showDataTypeName === ''
                                            ? selectCard.datatype
                                            : showDataTypeName;
                                    return <li>{showDataTypeName}</li>;
                                }
                            } else {
                                return (
                                    <li>
                                        {this.getMySelect(
                                            dataTypeObj(),
                                            'datatype'
                                        )}
                                    </li>
                                );
                            }
                        })()}
                        <li>{langCheck('ZoneSetting-000022', 'pages', json)}</li>
                        {/* /* 国际化处理： 类型设置*/ }
                        {(() => {
                            switch (true) {
                                case selectCard.datatype === '204': //参照
                                    return (
                                        <li>
                                            {this.getMySearch(
                                                'refname',
                                                'referModalVisibel'
                                            )}
                                            <ReferModal
                                                handleSelectChange={
                                                    this.handleSelectChange
                                                }
                                                
                                                dataval={selectCard.dataval}
                                                refname={selectCard.refname}
                                                iscode={selectCard.iscode}
                                                modalVisibel={
                                                    this.state.referModalVisibel
                                                }
                                                setModalVisibel={
                                                    this.setModalVisibel
                                                }
                                            />
                                        </li>
                                    );
                                case selectCard.datatype === '31' ||
                                    selectCard.datatype === '52' ||
                                    selectCard.datatype === '4': //31小数、4整数、52金额
                                    return (
                                        <li>
                                            {this.getMySearch(
                                                'dataval',
                                                'moneyModalVisibel'
                                            )}
                                            <MoneyModal
                                                datatype={selectCard.datatype}
                                                handleSelectChange={
                                                    this.handleSelectChange
                                                }
                                                initVal={selectCard.dataval}
                                                modalVisibel={
                                                    this.state.moneyModalVisibel
                                                }
                                                setModalVisibel={
                                                    this.setModalVisibel
                                                }
                                            />
                                        </li>
                                    );
                                case selectCard.datatype === '57': //自定义档案
                                    return (
                                        <li>
                                            {this.getMySearch(
                                                'dataval',
                                                'customModalVisibel'
                                            )}
                                            <CustomModal
                                                handleSelectChange={
                                                    this.handleSelectChange
                                                }
                                                initVal={selectCard.dataval}
                                                refname={selectCard.refname}
                                                // refname={this.refname.bind(this)}
                                                modalVisibel={
                                                    this.state
                                                        .customModalVisibel
                                                }
                                                setModalVisibel={
                                                    this.setModalVisibel
                                                }
                                            />
                                        </li>
                                    );
                                case selectCard.datatype === '203': //枚举
                                    return (
                                        <li>
                                            {this.getMyInput(
                                                langCheck('ZoneSetting-000022', 'pages', json),/* 国际化处理： 类型设置*/
                                                'showdataval'//枚举时显示'showdataval'为思康多语显示传值
                                            )}
                                        </li>
                                    );
                                case selectCard.datatype === '32': //逻辑
                                    return (
                                        <li>
                                            {this.getMyInput(
                                                langCheck('ZoneSetting-000022', 'pages', json),/* 国际化处理： 类型设置*/
                                                'showdataval'//枚举时显示'showdataval'为思康多语显示传值
                                            )}
                                        </li>
                                    );
                                default:
                                    return (
                                        <li>
                                            {this.getMyInput(
                                                langCheck('ZoneSetting-000022', 'pages', json),/* 国际化处理： 类型设置*/
                                                'dataval'
                                            )}
                                        </li>
                                    );
                            }
                        })()}
                        {/* 隐藏显示值 */}
                        {
                            (()=> {
                                if (selectCard.datatype == '203' || selectCard.datatype == '32') {//203为枚举，32为逻辑
                                    return (
                                        <li style={{display: 'none'}}>{langCheck('ZoneSetting-000022', 'pages', json)}</li>
                                    );
                                }
                            })()
                        }
                        {/* /* 国际化处理： 类型设置*/ }
                        {
                            (()=> {
                                if (selectCard.datatype == '203' || selectCard.datatype == '32') {//203为枚举，32为逻辑
                                    return (
                                        <li style={{display: 'none'}}>{this.getMyInput(langCheck('ZoneSetting-000022', 'pages', json), 'dataval')}</li>
                                    );
                                }
                            })()
                        }

                        {(() => {
                            if (isMetaData) {
                                //通过isdefined判断是否为自定义项，可以选择数据类型
                                if (!selectCard.isdefined) {
                                    return (
                                        <li style={{ display: isShowRelateMeta }}>
                                            {langCheck('ZoneSetting-000071', 'pages', json)}
                                            {/* /* 国际化处理： 元数据编辑关联项*/ }
                                        </li>
                                    );
                                }
                            }
                        })()}
                        {(() => {
                            if (isMetaData) {
                                //通过isdefined判断是否为自定义项，可以选择数据类型
                                if (!selectCard.isdefined) {
                                    return (
                                        <li style={{ display: isShowRelateMeta }}>
                                            {this.getMySearch(
                                                'relatemeta',
                                                'relateMetaModalVisibel'
                                            )}
                                            <RelateMetaModal
                                                cards={areaCardList}
                                                handleSelectChange={
                                                    this.handleSelectChange
                                                }
                                                initVal={selectCard.relatemeta}
                                                modalVisibel={
                                                    this.state
                                                        .relateMetaModalVisibel
                                                }
                                                setModalVisibel={
                                                    this.setModalVisibel
                                                }
                                            />
                                        </li>
                                    );
                                }
                            }
                        })()}

                        <li>{langCheck('ZoneSetting-000098', 'pages', json)}</li>
                        {/* /* 国际化处理： 组件类型*/ }
                        <li>
                            {this.getMySelect(
                                utilService.getItemtypeObjByDatatype(
                                    selectCard.datatype
                                ),
                                'itemtype'
                            )}
                        </li>
                        <li>{langCheck('ZoneSetting-000116', 'pages', json)}</li>
                        {/* /* 国际化处理： 显示公式*/ }
                        <li>
                            {this.getMyFormulaSearch('showformula')}
                            {(() => {
                                if (this.state.showformula) {
                                    return (
                                        <FormulaEditor
                                            value={selectCard['showformula']}
                                            isValidateOnOK={true}
                                            validateUrl={
                                                '/nccloud/platform/formula/check.do'
                                            }
                                            formulaUrl={`/nccloud/platform/formula/control.do`}
                                            treeParam={{
                                                pk_billtype: 'CM02',
                                                bizmodelStyle: 'fip',
                                                classid: ''
                                            }}
                                            noShowAttr={[langCheck('ZoneSetting-000106', 'pages', json)]}/* 国际化处理： 元数据属性*/
                                            show={this.state.showformula}
                                            onHide={() => {
                                                this.setState({
                                                    showformula: false
                                                });
                                            }}
                                            attrConfig={this.state.tab}
                                            onOk={val => {
                                                this.handleSelectChange(
                                                    val,
                                                    'showformula'
                                                );
                                                this.setState({
                                                    showformula: false
                                                });
                                            }}
                                            onCancel={() => {
                                                this.setState({
                                                    showformula: false
                                                });
                                            }}
                                        />
                                    );
                                }
                            })()}
                        </li>
                        <li>{langCheck('ZoneSetting-000117', 'pages', json)}</li>
                        {/* /* 国际化处理： 编辑公式*/ }
                        <li>
                            {this.getMyFormulaSearch('editformula')}
                            {(() => {
                                if (this.state.editformula) {
                                    return (
                                        <FormulaEditor
                                            value={selectCard['editformula']}
                                            isValidateOnOK={true}
                                            validateUrl={
                                                '/nccloud/platform/formula/check.do'
                                            }
                                            formulaUrl={`/nccloud/platform/formula/control.do`}
                                            noShowAttr={[langCheck('ZoneSetting-000106', 'pages', json)]}/* 国际化处理： 元数据属性*/
                                            show={this.state.editformula}
                                            onHide={() => {
                                                this.setState({
                                                    editformula: false
                                                });
                                            }}
                                            attrConfig={this.state.tab}
                                            onOk={val => {
                                                this.handleSelectChange(
                                                    val,
                                                    'editformula'
                                                );
                                                this.setState({
                                                    editformula: false
                                                });
                                            }}
                                            onCancel={() => {
                                                this.setState({
                                                    editformula: false
                                                });
                                            }}
                                        />
                                    );
                                }
                            })()}
                        </li>

                        <li>{langCheck('ZoneSetting-000118', 'pages', json)}</li>
                        {/* /* 国际化处理： 验证公式*/ }
                        <li>
                            {this.getMyFormulaSearch('validateformula')}
                            {(() => {
                                if (this.state.validateformula) {
                                    return (
                                        <FormulaEditor
                                            value={
                                                selectCard['validateformula']
                                            }
                                            isValidateOnOK={true}
                                            validateUrl={
                                                '/nccloud/platform/formula/check.do'
                                            }
                                            formulaUrl={`/nccloud/platform/formula/control.do`}
                                            noShowAttr={[langCheck('ZoneSetting-000106', 'pages', json)]}/* 国际化处理： 元数据属性*/
                                            show={this.state.validateformula}
                                            onHide={() => {
                                                this.setState({
                                                    validateformula: false
                                                });
                                            }}
                                            attrConfig={this.state.tab}
                                            onOk={val => {
                                                this.handleSelectChange(
                                                    val,
                                                    'validateformula'
                                                );
                                                this.setState({
                                                    validateformula: false
                                                });
                                            }}
                                            onCancel={() => {
                                                this.setState({
                                                    validateformula: false
                                                });
                                            }}
                                        />
                                    );
                                }
                            })()}
                        </li>

                        <li>{langCheck('ZoneSetting-000119', 'pages', json)}</li>
                        {/* /* 国际化处理： 超链接*/ }
                        <li>{this.getMyCheckbox('hyperlinkflag')}</li>
                        <li>{langCheck('ZoneSetting-000120', 'pages', json)}</li>
                        {/* /* 国际化处理： 元数据访问路径*/ }
                        <li title={selectCard.metapath} className="metapath">
                            {selectCard.metapath}
                        </li>
                        <li>{langCheck('ZoneSetting-000101', 'pages', json)}</li>
                        {/* /* 国际化处理： 自定义1*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000101', 'pages', json), 'define1')}</li>
                        {/* /* 国际化处理： 自定义1*/ }
                        <li>{langCheck('ZoneSetting-000102', 'pages', json)}</li>
                        {/* /* 国际化处理： 自定义2*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000102', 'pages', json), 'define2')}</li>
                        {/* /* 国际化处理： 自定义2*/ }
                        <li>{langCheck('ZoneSetting-000103', 'pages', json)}</li>
                        {/* /* 国际化处理： 自定义3*/ }
                        <li>{this.getMyInput(langCheck('ZoneSetting-000103', 'pages', json), 'define3')}</li>
                        {/* /* 国际化处理： 自定义3*/ }
                    </ul>
                </TabPane>
            </Tabs>
        );
    };

    // 获取主表
    getMainArea = (areaList, headcode) => {
        if (!headcode) return;
        let result;
        _.forEach(areaList, (val, index) => {
            if (val.code === headcode) {
                result = val;
                return;
            }
        });
        return result;
    };

    // componentWillUpdate(nextProps,nextState) {
    // 		this.handleFormula(nextProps);
    // }

    // 公式编辑器
    handleFormula = () => {
        const { selectCard, areaList } = this.props;
        if (_.isEmpty(selectCard) || _.isEmpty(areaList)) return;
        let headcode = areaList[0] && areaList[0].headcode;
        let area = this.getArea(areaList, selectCard); //当前区域
        let tab;
        //  tab页需要展示当前区域和表头区域
        //如果headcode不存在存在
        if (!headcode || (headcode && headcode === area.code)) {
            tab = [
                {
                    tab: area.name,
                    TabPaneContent: utilService.Formula,
                    params: { name: area }
                }
            ];
        } else if (headcode && headcode !== area.code) {
            //如果headcode不存在存在
            let mainArea = this.getMainArea(areaList, headcode); //表头区域
            tab = [
                {
                    tab: area.name,
                    key: 'main',
                    TabPaneContent: utilService.Formula,
                    params: { name: area }
                },
                {
                    tab: mainArea.name,
                    key: 'head',
                    TabPaneContent: utilService.Formula,
                    params: { name: mainArea }
                }
            ];
        }
        this.setState({ tab });
    };
    render() {
        const { selectCard, areaList } = this.props;
        // 1 判断是否是元数据 2 判断所属的类型是否是查询区  默认是 不是元数据 不是查询区
        // 处理公式编辑器
        let result_div;
        if (_.isEmpty(selectCard)) {
            result_div = <div />;
        } else {
            let isMetaData = this.getMetaType(selectCard);
            let areaType = this.getAreaType(areaList, selectCard);
            let isSearch = areaType === '0';
            if (isSearch) {
                //不区分显示属性和高级属性
                if (isMetaData) {
                    //元数据中metapath 和datatype和类型设置 为只读
                    result_div = this.getDom1();
                } else {
                    //非元数据metapath为空且只读，datatype和类型设置 为可以设置
                    result_div = this.getDom2();
                }
            } else {
                //非查询区，元数据||非元数据
                result_div = this.getDom3(areaType, isMetaData);
            }
        }

        return (
            <div className="template-setting-right-sider template-setting-sider">
                <div className="sider-content">
                    <div className="sider-tab" >{result_div}</div>
                </div>
            </div>
        );
    }
}
export default connect(
    state => ({
        areaList: state.zoneSettingData.areaList,
        selectCard: state.zoneSettingData.selectCard
    }),
    {
        updateAreaList,
        updateSelectCard
    }
)(MyRightSider);

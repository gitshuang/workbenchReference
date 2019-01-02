import React from "react";
import { AutoComplete } from "antd";
import { DeferFn, langCheck } from "Pub/js/utils";
import Ajax from "Pub/js/ajax";
class SearchApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            // searchValue: "",
            isShowSearch: false
        };
    }
    /**
     * 搜索全部应用选中应用操作
     */
    onSelect = value => {
        const { dataSource } = this.state;
        let targetApp = {};
        dataSource.map(d => {
            if (d.value === value) {
                targetApp = d;
            }
        });
        // this.setState({
        //     searchValue: targetApp.text
        // });
        window.openNew(targetApp);
    };
    /**
     * 搜索全部应用 查询操作
     */
    handleSearch = value => {
        if (value === "") {
            return;
        }
        let fn = () => {
            Ajax({
                url: `/nccloud/platform/appregister/searchmenuitem.do`,
                info: {
                    name: langCheck('0000PUB-000123'),/* 国际化处理： 应用搜索*/
                    appcode: "10228888",
                    action: langCheck('0000PUB-000124')/* 国际化处理： 模糊搜索应用*/
                },
                data: {
                    search_content: value,
                    apptype: "1"
                },
                success: res => {
                    const { data, success } = res.data;
                    if (
                        success &&
                        data &&
                        data.children &&
                        data.children.length > 0
                    ) {
                        const dataSource = [];
                        data.children.map(c => {
                            dataSource.push({
                                value: c.value,
                                text: c.label,
                                code: c.code,
                                appcode: c.appcode,
                                label: c.label,
                                appid: c.appid
                            });
                        });
                        this.setState({ dataSource });
                    }
                }
            });
        };
        DeferFn(fn);
    };
    /**
     * 搜索全部应用 输入框展开
     */
    changeSearchInput = () => {
        const { isShowSearch } = this.state;
        this.setState({ isShowSearch: !isShowSearch }, () => {
            if (this.state.isShowSearch) {
                this.autoCompleteInput.focus();
            }
        });
    };
    /**
     * 重新获取焦点时拿到input的值
     */
    getFocusValue = () => {
        //重新获取焦点时需要拿到input值进行拆分
        let searchValue = document.getElementById('allApply').outerText;
        let focusValue = searchValue.replace(/[\r\n]/g,"").trim();
        let lastFocusValue = focusValue.substring(0,focusValue.length-2);//去掉字符串的后两位
        this.handleSearch(lastFocusValue);
    }
    render() {
        let { dataSource, isShowSearch } = this.state;
        return (
            <div
                field="global-search"
                fieldname={langCheck('0000PUB-000125')}/* 国际化处理： 全局搜索*/
                className="margin-right-20 autocomplete"
            >
                {isShowSearch ? (
                    <AutoComplete
                        id='allApply'
                        allowClear={true}
                        ref={input => (this[`autoCompleteInput`] = input)}
                        dataSource={dataSource}
                        dropdownClassName={"field_global-search"}
                        style={{ width: 200, height: 30 }}
                        onSelect={this.onSelect}
                        onSearch={value => {
                            this.handleSearch(value);
                        }}
                        onChange={value => {
                            this.handleSearch(value);
                        }}
                        placeholder={langCheck('0000PUB-000126')}/* 国际化处理： 请输入应用名称*/
                        //onFocus会引起存包保留原来的value值不能更新操作需要重新获取输入框中的值
                        onFocus={() => {
                            this.getFocusValue();
                        }}
                    />
                ) : null}
                <i
                    field="search"
                    fieldname={langCheck('0000PUB-000127')}/* 国际化处理： 查询*/
                    className="iconfont icon-sousuo"
                    onClick={this.changeSearchInput}
                />
            </div>
        );
    }
}
export default SearchApp;

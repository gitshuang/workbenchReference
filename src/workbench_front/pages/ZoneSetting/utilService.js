import { langZoneSetting } from 'Pub/js/utils';

//公式编辑器
export function Formula({ setName, setExplain, name }) {
    return (
        <div className="Formula" style={{maxHeight:'300px'}}>
            <ul>
                {(() => {
                    let propertyList = name && name.queryPropertyList;
                    return (
                        propertyList &&
                        propertyList.map((v, i) => {
                            return (
                                <li
									onClick={() => {
                                        setExplain(`${name.code}.${v.code}`);
                                    }}
                                    onDoubleClick={() => {
                                        setName(`${name.code}.${v.code}`);
                                    }}
                                    key={i}
                                >
                                    {v.label}
                                </li>
                            );
                        })
                    );
                })()}
            </ul>
        </div>
    );
}
/** 
 * 通过datatype获取对应的字典中对应的name值
 * @param {String} datatype 数据类型的key值
 * @param {Array} objectArr 字典数组
 * @return {String} name 数据类型的名称
 */
export const getObjNameByDatatype = (datatype, objectArr) => {
    let name = "";
    for (let i = 0; i < objectArr.length; i++) {
        if (objectArr[i].value === datatype) {
            name = objectArr[i].name;
        }
    }
    return name;
};
/** 
 * 通过datatype获取对应的组件类型value值，即itemtype值
 * @param {String} datatype 数据类型的key值
 * @return {String} name 组件类型value值
 */
export const getItemtypeByDatatype = datatype => {
    let result = getItemtypeObjByDatatype(datatype);
    return result[0].value;
};
/** 
 * 通过datatype获取对应的组件类型对象，如果找不到，则取全部的组件类型对象
 * @param {String} datatype 数据类型的key值
 * @return {Object} itemtypeObj 组件类型对象
 */
export const getItemtypeObjByDatatype = datatype => {
    let result = {};
    result = _.find(filterItemtypeObj(), f => {
        return f.datatype === datatype;
    });
    if (!result) {
        result = {};
        result.itemtypeObj = itemtypeObj();//自由辅助属性多语问题处理
    }
    return result.itemtypeObj;
};
//操作符编码
export const opersignObj = [
    { name: "=@like@left like@right like@", value: "1" },
    { name: "between@=@>@>=@<@<=@", value: "4" },
    { name: "=@", value: "32" },
    { name: "between@=@>@>=@<@<=@", value: "33" },
    { name: "between@=@>@>=@<@<=@", value: "34" },
    { name: "between@=@>@>=@<@<=@", value: "36" },
    { name: "between@=@>@>=@<@<=@", value: "52" },
    { name: "=@like@left like@right like@", value: "56" },
    { name: "=@like@left like@right like@", value: "58" },
    { name: "=@<>@", value: "203" },
    { name: "=", value: "204" }
];
//操作符名称
export const opersignNameObj = () => [
    { name: langZoneSetting('ZoneSetting-000127'), value: "1" },/* 国际化处理： 等于@包含@左包含@右包含@*/
    { name: langZoneSetting('ZoneSetting-000128'), value: "4" },/* 国际化处理： 介于@等于@大于@大于等于@小于@小于等于@*/
    { name: langZoneSetting('ZoneSetting-000129'), value: "32" },/* 国际化处理： 等于@*/
    { name: langZoneSetting('ZoneSetting-000128'), value: "33" },/* 国际化处理： 介于@等于@大于@大于等于@小于@小于等于@*/
    { name: langZoneSetting('ZoneSetting-000128'), value: "34" },/* 国际化处理： 介于@等于@大于@大于等于@小于@小于等于@*/
    { name: langZoneSetting('ZoneSetting-000128'), value: "36" },/* 国际化处理： 介于@等于@大于@大于等于@小于@小于等于@*/
    { name: langZoneSetting('ZoneSetting-000128'), value: "52" },/* 国际化处理： 介于@等于@大于@大于等于@小于@小于等于@*/
    { name: langZoneSetting('ZoneSetting-000127'), value: "56" },/* 国际化处理： 等于@包含@左包含@右包含@*/
    { name: langZoneSetting('ZoneSetting-000127'), value: "58" },/* 国际化处理： 等于@包含@左包含@右包含@*/
    { name: langZoneSetting('ZoneSetting-000130'), value: "203" },/* 国际化处理： 等于@不等于@*/
    { name: langZoneSetting('ZoneSetting-000129'), value: "204" }/* 国际化处理： 等于@*/
];
//显示类型
export const showType  = () => [
    { name: langZoneSetting('ZoneSetting-000131'), value: "1" },/* 国际化处理： 名称*/
    { name: langZoneSetting('ZoneSetting-000081'), value: "2" }/* 国际化处理： 编码*/
];
//返回类型
export const returnType = () => [
    { name: langZoneSetting('ZoneSetting-000132'), value: "refpk" },/* 国际化处理： 主键*/
    { name: langZoneSetting('ZoneSetting-000131'), value: "refname" },/* 国际化处理： 名称*/
    { name: langZoneSetting('ZoneSetting-000081'), value: "refcode" }/* 国际化处理： 编码*/
];
//颜色
export const colorObj = () =>[
    { name: langZoneSetting('ZoneSetting-000133'), value: "#555555" },/* 国际化处理： 默认*/
    { name: langZoneSetting('ZoneSetting-000134'), value: "#000000" },/* 国际化处理： 黑色*/
    { name: langZoneSetting('ZoneSetting-000135'), value: "#ffffff" },/* 国际化处理： 白色*/
    { name: langZoneSetting('ZoneSetting-000136'), value: "#DCDCDC" },/* 国际化处理： 浅灰色*/
    { name: langZoneSetting('ZoneSetting-000137'), value: "#7C7C7C" },/* 国际化处理： 灰色*/
    { name: langZoneSetting('ZoneSetting-000138'), value: "#434343" },/* 国际化处理： 深灰色*/
    { name: langZoneSetting('ZoneSetting-000139'), value: "#EC1D22" },/* 国际化处理： 红色*/
    { name: langZoneSetting('ZoneSetting-000140'), value: "#F78C92" },/* 国际化处理： 粉色*/
    { name: langZoneSetting('ZoneSetting-000141'), value: "#F5781E" },/* 国际化处理： 橘色*/
    { name: langZoneSetting('ZoneSetting-000142'), value: "#F8F36F" },/* 国际化处理： 黄色*/
    { name: langZoneSetting('ZoneSetting-000143'), value: "#2AB566" },/* 国际化处理： 绿色*/
    { name: langZoneSetting('ZoneSetting-000144'), value: "#C11B80" },/* 国际化处理： 紫红色*/
    { name: langZoneSetting('ZoneSetting-000145'), value: "#23C1C4" },/* 国际化处理： 蓝绿色*/
    { name: langZoneSetting('ZoneSetting-000146'), value: "#6FCBFF" },/* 国际化处理： 兰色*/
    { name: langZoneSetting('ZoneSetting-000147'), value: "#00A2FE" }/* 国际化处理： 深兰色*/
];
//默认值
export const defaultvarObj = [
    { name: "", value: "" },
    { name: "@SYSCORP", value: "@SYSCORP" },
    { name: "@SYSOPER", value: "@SYSOPER" },
    { name: "@SYSUSER", value: "@SYSUSER" },
    { name: "@SYSDEPT", value: "@SYSDEPT" }
];
//组件类型
export const itemtypeObj = () => [
    { name: langZoneSetting('ZoneSetting-000148'), value: "input" },/* 国际化处理： 文本输入框*/
    { name: langZoneSetting('ZoneSetting-000149'), value: "checkbox" },/* 国际化处理： 复选*/
    { name: langZoneSetting('ZoneSetting-000150'), value: "datepicker" },/* 国际化处理： 单选日期*/
    { name: langZoneSetting('ZoneSetting-000151'), value: "label" },/* 国际化处理： 静态文本*/
    { name: langZoneSetting('ZoneSetting-000152'), value: "number" },/* 国际化处理： 数值输入框*/
    { name: langZoneSetting('ZoneSetting-000153'), value: "radio" },/* 国际化处理： 单选*/
    { name: langZoneSetting('ZoneSetting-000062'), value: "refer" },/* 国际化处理： 参照*/
    { name: langZoneSetting('ZoneSetting-000154'), value: "select" },/* 国际化处理： 下拉选择*/
    { name: langZoneSetting('ZoneSetting-000155'), value: "switch" },/* 国际化处理： 开关*/
    { name: langZoneSetting('ZoneSetting-000156'), value: "textarea" },/* 国际化处理： 多行文本*/
    { name: langZoneSetting('ZoneSetting-000157'), value: "datetimepicker" },/* 国际化处理： 日期时间*/
    { name: langZoneSetting('ZoneSetting-000158'), value: "timepicker" },/* 国际化处理： 时间*/
    { name: langZoneSetting('ZoneSetting-000159'), value: "rangepicker" },/* 国际化处理： 日期范围*/
    { name: langZoneSetting('ZoneSetting-000160'), value: "NCTZDatePickerStart" },/* 国际化处理： 开始日期时间*/
    { name: langZoneSetting('ZoneSetting-000161'), value: "NCTZDatePickerEnd" },/* 国际化处理： 结束日期时间*/
    { name: langZoneSetting('ZoneSetting-000162'), value: "checkbox_switch" },/* 国际化处理： 开关型复选框*/
    { name: langZoneSetting('ZoneSetting-000163'), value: "switch_browse" },/* 国际化处理： 停启用开关*/
    { name: langZoneSetting('ZoneSetting-000164'), value: "residtxt" },/* 国际化处理： 多语文本*/
    { name: langZoneSetting('ZoneSetting-000165'), value: "password" }/* 国际化处理： 密码框*/
];
//数据类型
export const dataTypeObj = () => [
    { name: langZoneSetting('ZoneSetting-000166'), value: "1" },/* 国际化处理： 字符*/
    { name: langZoneSetting('ZoneSetting-000167'), value: "4" },/* 国际化处理： 整数*/
    { name: langZoneSetting('ZoneSetting-000168'), value: "30" },/* 国际化处理： 大文本*/
    { name: langZoneSetting('ZoneSetting-000169'), value: "31" },/* 国际化处理： 小数*/
    { name: langZoneSetting('ZoneSetting-000170'), value: "32" },/* 国际化处理： 逻辑*/
    { name: langZoneSetting('ZoneSetting-000171'), value: "33" },/* 国际化处理： 日期*/
    { name: langZoneSetting('ZoneSetting-000157'), value: "34" },/* 国际化处理： 日期时间*/
    { name: langZoneSetting('ZoneSetting-000158'), value: "36" },/* 国际化处理： 时间*/
    { name: langZoneSetting('ZoneSetting-000172'), value: "37" },/* 国际化处理： 开始日期*/
    { name: langZoneSetting('ZoneSetting-000173'), value: "38" },/* 国际化处理： 结束日期*/
    { name: langZoneSetting('ZoneSetting-000174'), value: "39" },/* 国际化处理： 日期（无时区）*/
    { name: langZoneSetting('ZoneSetting-000132'), value: "51" },/* 国际化处理： 主键*/
    { name: langZoneSetting('ZoneSetting-000175'), value: "52" },/* 国际化处理： 金额*/
    { name: langZoneSetting('ZoneSetting-000176'), value: "56" },/* 国际化处理： 自定义项*/
    { name: langZoneSetting('ZoneSetting-000023'), value: "57" },/* 国际化处理： 自定义档案*/
    { name: langZoneSetting('ZoneSetting-000164'), value: "58" },/* 国际化处理： 多语文本*/
    { name: langZoneSetting('ZoneSetting-000187'), value: "59" },/* 国际化处理： 自由辅助属性*/
    { name: langZoneSetting('ZoneSetting-000177'), value: "203" },/* 国际化处理： 枚举*/
    { name: langZoneSetting('ZoneSetting-000062'), value: "204" },/* 国际化处理： 参照*/
    { name: langZoneSetting('ZoneSetting-000165'), value: "400" }/* 国际化处理： 密码框*/
];
//数据类型和组件类型字典
export const filterItemtypeObj = () => [
    {
        datatype: "1",
        itemtypeObj: [
            { name: langZoneSetting('ZoneSetting-000148'), value: "input" },/* 国际化处理： 文本输入框*/
            { name: langZoneSetting('ZoneSetting-000151'), value: "label" }/* 国际化处理： 静态文本*/
        ]
    },
    { datatype: "4", itemtypeObj: [{ name: langZoneSetting('ZoneSetting-000152'), value: "number" }] },/* 国际化处理： 数值输入框*/
    { datatype: "30", itemtypeObj: [{ name: langZoneSetting('ZoneSetting-000156'), value: "textarea" }] },/* 国际化处理： 多行文本*/
    { datatype: "31", itemtypeObj: [{ name: langZoneSetting('ZoneSetting-000152'), value: "number" }] },/* 国际化处理： 数值输入框*/
    {
        datatype: "32",
        itemtypeObj: [
            { name: langZoneSetting('ZoneSetting-000149'), value: "checkbox" },/* 国际化处理： 复选*/
            { name: langZoneSetting('ZoneSetting-000153'), value: "radio" },/* 国际化处理： 单选*/
            { name: langZoneSetting('ZoneSetting-000155'), value: "switch" },/* 国际化处理： 开关*/
            { name: langZoneSetting('ZoneSetting-000163'), value: "switch_browse" },/* 国际化处理： 停启用开关*/
            { name: langZoneSetting('ZoneSetting-000162'), value: "checkbox_switch" }/* 国际化处理： 开关型复选框*/
        ]
    },
    {
        datatype: "33",
        itemtypeObj: [
            { name: langZoneSetting('ZoneSetting-000171'), value: "datepicker" }/* 国际化处理： 日期*/
        ]
    },
    {
        datatype: "34",
        itemtypeObj: [{ name: langZoneSetting('ZoneSetting-000157'), value: "datetimepicker" }]/* 国际化处理： 日期时间*/
    },
    {
        datatype: "36",
        itemtypeObj: [{ name: langZoneSetting('ZoneSetting-000158'), value: "timepicker" }]/* 国际化处理： 时间*/
    },
    {
        datatype: "37",
        itemtypeObj: [{ name: langZoneSetting('ZoneSetting-000172'), value: "NCTZDatePickerStart" }]/* 国际化处理： 开始日期*/
    },
    {
        datatype: "38",
        itemtypeObj: [{ name: langZoneSetting('ZoneSetting-000173'), value: "NCTZDatePickerEnd" }]/* 国际化处理： 结束日期*/
    },
    {
        datatype: "39",
        itemtypeObj: [{ name: langZoneSetting('ZoneSetting-000174'), value: "datePickerNoTimeZone" }]/* 国际化处理： 日期（无时区）*/
    },
    { datatype: "51", itemtypeObj: [{ name: langZoneSetting('ZoneSetting-000148'), value: "input" }] },/* 国际化处理： 文本输入框*/
    { datatype: "52", itemtypeObj: [{ name: langZoneSetting('ZoneSetting-000152'), value: "number" }] },/* 国际化处理： 数值输入框*/
    { datatype: "56", itemtypeObj: [{ name: langZoneSetting('ZoneSetting-000148'), value: "input" }] },/* 国际化处理： 文本输入框*/
    { datatype: "57", itemtypeObj: [{ name: langZoneSetting('ZoneSetting-000062'), value: "refer" }] },/* 国际化处理： 参照*/
    { datatype: "58", itemtypeObj: [{ name: langZoneSetting('ZoneSetting-000164'), value: "residtxt" }] },/* 国际化处理： 多语文本*/
    // { datatype: "59", itemtypeObj: [{ name: langZoneSetting('ZoneSetting-000187'), value: "input" }] },/* 国际化处理： 自由辅助属性*/
    {
        datatype: "203",
        itemtypeObj: [
            { name: langZoneSetting('ZoneSetting-000178'), value: "select" },/* 国际化处理： 下拉*/
            { name: langZoneSetting('ZoneSetting-000149'), value: "checkbox" },/* 国际化处理： 复选*/
            { name: langZoneSetting('ZoneSetting-000153'), value: "radio" }/* 国际化处理： 单选*/
        ]
    },
    {
        datatype: "204",
        itemtypeObj: [
            { name: langZoneSetting('ZoneSetting-000062'), value: "refer" },/* 国际化处理： 参照*/
            { name: langZoneSetting('ZoneSetting-000178'), value: "select" }/* 国际化处理： 下拉*/
        ]
    },
    { datatype: "400", itemtypeObj: [{ name: langZoneSetting('ZoneSetting-000165'), value: "password" }] }/* 国际化处理： 密码框*/
];
//应该设默认值为false的组件类型
export const shouldSetDefaultValueList = [
    "switch",
    "checkbox_switch",
    "switch_browse"
];

/* 参照用
注：复制的艺轩的方法 
*/
export function handleLoad(refcode) {
    try {
        let Item = window[refcode].default;
        // const myRefDom = typeof Item === "function" ? Item() : <Item />;
        this.setState({ [`myRefDom${refcode}`]: Item });
    } catch (e) {
        console.error(e.message);
        console.error(
            `${langZoneSetting('ZoneSetting-000179')}${refcode}${langZoneSetting('ZoneSetting-000180')}。${langZoneSetting('ZoneSetting-000181')}config.json/buildEntryPath${langZoneSetting('ZoneSetting-000182')}，${langZoneSetting('ZoneSetting-000183')}`/* 国际化处理： 请检查引用的,这个文件是源码还是编译好的,源码需要在,配相应的路径,编译好的则不用*/
        );
    }
}
/* 单据模板设置页面，参照的调用，
   注：复制的艺轩的方法 
*/
export function createScript(src) {
    let that = this,
        scripts = Array.from(document.getElementsByTagName("script")),
        s = src.split("/"),
        flag,
        refKey;
    refKey = s.slice(s.length - 5).join("/");
    refKey.includes(".js") && (refKey = refKey.substring(0, refKey.length - 3));
    flag = scripts.find(e => {
        return e.src.includes(refKey);
    });
    if (window[refKey]) {
        // 已经加载过script标签
        handleLoad.call(that, refKey);
    } else {
        let script;
        if (flag) {
            script = flag;
        } else {
            script = document.createElement("script");
            //参照默认取值相对路径改为绝对路径
            script.src = "/nccloud/resources/" + refKey + ".js";
            script.type = "text/javascript";
            document.body.appendChild(script);
        }

        script.onload = script.onload || handleLoad.bind(that, refKey);
        script.onerror =
            script.onerror ||
            function() {
                console.error(`${langZoneSetting('ZoneSetting-000184')}${src}${langZoneSetting('ZoneSetting-000185')}，${langZoneSetting('ZoneSetting-000186')}`);/* 国际化处理： 找不到,这个文件,请检查引用路径*/
            };
    }
}
//查询区批量设置字典
export const batchSearchData = () => [
    {
        title: langZoneSetting('ZoneSetting-000081'),/* 国际化处理： 编码*/
        property: "code",
        type: "text",
        width: 132
    },
    {
        title: langZoneSetting('ZoneSetting-000076'),/* 国际化处理： 显示名称*/
        property: "label",
        type: "input",
        width: 132
    },
    {
        title: langZoneSetting('ZoneSetting-000079'),/* 国际化处理： 非元数据条件*/
        property: "isnotmeta",
        type: "checkbox",
        width: 135,
        indeterminate: true,
        checkAll: true
    },
    {
        title: langZoneSetting('ZoneSetting-000080'),/* 国际化处理： 使用*/
        property: "isuse",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000082'),/* 国际化处理： 操作符编码*/
        property: "opersign",
        type: "input",
        width: 132
    },
    {
        title: langZoneSetting('ZoneSetting-000083'),/* 国际化处理： 操作符名称*/
        property: "opersignname",
        type: "input",
        width: 132
    },
    {
        title: langZoneSetting('ZoneSetting-000085'),/* 国际化处理： 不可修改*/
        property: "disabled",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000086'),/* 国际化处理： 默认显示*/
        property: "visible",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000087'),/* 国际化处理： 默认显示字段排序*/
        property: "visibleposition",
        type: "input",
        width: 132
    },
    {
        title: langZoneSetting('ZoneSetting-000088'),/* 国际化处理： 多选*/
        property: "ismultiselectedenabled",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000089'),/* 国际化处理： 固定条件*/
        property: "isfixedcondition",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000090'),/* 国际化处理： 必输条件*/
        property: "required",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000091'),/* 国际化处理： 查询条件*/
        property: "isquerycondition",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000030'),/* 国际化处理： 参照名称*/
        property: "refname",
        type: "input",
        width: 132
    },
    {
        title: langZoneSetting('ZoneSetting-000092'),/* 国际化处理： 参照包含下级*/
        property: "containlower",
        type: "checkbox",
        width: 135,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000093'),/* 国际化处理： 参照自动检查*/
        property: "ischeck",
        type: "checkbox",
        width: 135,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000094'),/* 国际化处理： 参照跨集团*/
        property: "isbeyondorg",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000095'),/* 国际化处理： 使用系统函数*/
        property: "usefunc",
        type: "checkbox",
        width: 135,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000099'),/* 国际化处理： 显示类型*/
        property: "showtype",
        type: "select",
        width: 132,
        selectObj: showType()
    },
    {
        title: langZoneSetting('ZoneSetting-000100'),/* 国际化处理： 返回类型*/
        property: "returntype",
        type: "select",
        width: 132,
        selectObj: returnType()
    },
    // {
    //     title: "组件类型",
    //     property: "itemtype",
    //     type: "select",
    //     width: 50,
    //     selectObj: utilService.getItemtypeObjByDatatype(selectCard.datatype)
    // },
    {
        title: langZoneSetting('ZoneSetting-000101'),/* 国际化处理： 自定义1*/
        property: "define1",
        type: "input",
        width: 132,
    },
    {
        title: langZoneSetting('ZoneSetting-000102'),/* 国际化处理： 自定义2*/
        property: "define2",
        type: "input",
        width: 132,
    },
    {
        title: langZoneSetting('ZoneSetting-000103'),/* 国际化处理： 自定义3*/
        property: "define3",
        type: "input",
        width: 132,
    },
    {
        title: langZoneSetting('ZoneSetting-000104'),/* 国际化处理： 自定义4*/
        property: "define4",
        type: "input",
        width: 132,
    },
    {
        title: langZoneSetting('ZoneSetting-000105'),/* 国际化处理： 自定义5*/
        property: "define5",
        type: "input",
        width: 132,
    }
];
//表单批量设置字典
export const batchFormData = () => [
    {
        title: langZoneSetting('ZoneSetting-000081'),/* 国际化处理： 编码*/
        property: "code",
        type: "text",
        width: 132
    },
    {
        title: langZoneSetting('ZoneSetting-000076'),/* 国际化处理： 显示名称*/
        property: "label",
        type: "input",
        width: 132
    },
    {
        title: langZoneSetting('ZoneSetting-000031'),/* 国际化处理： 占用列数*/
        property: "colnum",
        type: "input",
        width: 132
    },
    {
        title: langZoneSetting('ZoneSetting-000032'),/* 国际化处理： 最大长度*/
        property: "maxlength",
        type: "input",
        width: 132
    },
    {
        title: langZoneSetting('ZoneSetting-000109'),/* 国际化处理： 可修订*/
        property: "isrevise",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000110'),/* 国际化处理： 另起一行*/
        property: "isnextrow",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000112'),/* 国际化处理： 可见*/
        property: "visible",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000113'),/* 国际化处理： 必输项*/
        property: "required",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000085'),/* 国际化处理： 不可修改*/
        property: "disabled",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000114'),/* 国际化处理： 默认系统变量*/
        property: "defaultvar",
        type: "select",
        width: 132,
        selectObj: defaultvarObj
    },
    {
        title: langZoneSetting('ZoneSetting-000115'),/* 国际化处理： 显示颜色*/
        property: "color",
        type: "select",
        width: 132,
        selectObj: colorObj()
    },
    {
        title: langZoneSetting('ZoneSetting-000101'),/* 国际化处理： 自定义1*/
        property: "define1",
        type: "input",
        width: 132,
    },
    {
        title: langZoneSetting('ZoneSetting-000102'),/* 国际化处理： 自定义2*/
        property: "define2",
        type: "input",
        width: 132,
    },
    {
        title: langZoneSetting('ZoneSetting-000103'),/* 国际化处理： 自定义3*/
        property: "define3",
        type: "input",
        width: 132,
    }
];
//表格批量设置字典
export const batchTableData = () => [
    {
        title: langZoneSetting('ZoneSetting-000081'),/* 国际化处理： 编码*/
        property: "code",
        type: "text",
        width: 132
    },
    {
        title: langZoneSetting('ZoneSetting-000076'),/* 国际化处理： 显示名称*/
        property: "label",
        type: "input",
        width: 132
    },
    {
        title: langZoneSetting('ZoneSetting-000108'),/* 国际化处理： 组件长度*/
        property: "width",
        type: "input",
        width: 132
    },
    {
        title: langZoneSetting('ZoneSetting-000032'),/* 国际化处理： 最大长度*/
        property: "maxlength",
        type: "input",
        width: 132
    },
    {
        title: langZoneSetting('ZoneSetting-000109'),/* 国际化处理： 可修订*/
        property: "isrevise",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000111'),/* 国际化处理： 合计*/
        property: "istotal",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000112'),/* 国际化处理： 可见*/
        property: "visible",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000113'),/* 国际化处理： 必输项*/
        property: "required",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000085'),/* 国际化处理： 不可修改*/
        property: "disabled",
        type: "checkbox",
        width: 132,
        indeterminate: true,
        checkAll: false
    },
    {
        title: langZoneSetting('ZoneSetting-000114'),/* 国际化处理： 默认系统变量*/
        property: "defaultvar",
        type: "select",
        width: 132,
        selectObj: defaultvarObj
    },
    {
        title: langZoneSetting('ZoneSetting-000115'),/* 国际化处理： 显示颜色*/
        property: "color",
        type: "select",
        width: 132,
        selectObj: colorObj()
    },
    {
        title: langZoneSetting('ZoneSetting-000101'),/* 国际化处理： 自定义1*/
        property: "define1",
        type: "input",
        width: 132,
    },
    {
        title: langZoneSetting('ZoneSetting-000102'),/* 国际化处理： 自定义2*/
        property: "define2",
        type: "input",
        width: 132,
    },
    {
        title: langZoneSetting('ZoneSetting-000103'),/* 国际化处理： 自定义3*/
        property: "define3",
        type: "input",
        width: 132,
    }
];
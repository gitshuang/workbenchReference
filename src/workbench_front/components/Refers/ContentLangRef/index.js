import React from "react";
import { high } from "nc-lightapp-front";
import {langCheck} from "Pub/js/utils";
const { Refer } = high;
/**
 * 内容语种参照
 * @param {*} props
 */
export default (props = {}) => {
    var conf = {
        refType: "grid",
        refName: langCheck('0000PUB-000056'),/* 国际化处理： 内容语种*/
        refCode: "code",
        placeholder: langCheck('0000PUB-000056'),/* 国际化处理： 内容语种*/
        queryGridUrl: "/nccloud/platform/appregister/multilangref.do",
        columnConfig: [{ name: [langCheck('0000PUB-000032'), langCheck('0000PUB-000033')], code: ["refcode", "refname"] }],/* 国际化处理： 编码,名称*/
        isMultiSelectedEnabled: false
    };
    return <Refer {...Object.assign(conf, props)} />;
};

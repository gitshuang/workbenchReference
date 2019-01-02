import React from "react";
import { high } from "nc-lightapp-front";
import {langCheck} from "Pub/js/utils";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        refType: "grid",
        refName: langCheck('0000PUB-000060'),/* 国际化处理： 自定义档案*/
        placeholder: langCheck('0000PUB-000060'),/* 国际化处理： 自定义档案*/
        refCode: "uapbd.refer.userdef.DefdocGridRef",
        queryGridUrl: "/nccloud/uapbd/userdef/DefdocGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [{ name: [langCheck('0000PUB-000032'), langCheck('0000PUB-000033')], code: ["code", "name"] }]/* 国际化处理： 编码,名称*/
    };
    return <Refer {...Object.assign(conf, props)} />;
}

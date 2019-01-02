import React from "react";
import { high } from "nc-lightapp-front";
import {langCheck} from "Pub/js/utils";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        refType: "grid",
        refName: langCheck('0000PUB-000058'),/* 国际化处理： 信用控制域*/
        placeholder: langCheck('0000PUB-000058'),/* 国际化处理： 信用控制域*/
        refCode: "uapbd.refer.org.CreditCtlRegionGridRef",
        queryGridUrl: "/nccloud/uapbd/org/CreditCtlRegionGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [{ name: [langCheck('0000PUB-000032'), langCheck('0000PUB-000033')], code: ["refcode", "refname"] }]/* 国际化处理： 编码,名称*/
    };

    return <Refer {...Object.assign(conf, props)} />;
}

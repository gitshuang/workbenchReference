import React from "react";
import { high } from "nc-lightapp-front";
import {langCheck} from "Pub/js/utils";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        refType: "grid",
        refName: langCheck('0000PUB-000057'),/* 国际化处理： 成本域*/
        placeholder: langCheck('0000PUB-000057'),/* 国际化处理： 成本域*/
        refCode: "uapbd.org.CostRegionDefaultGridRef",
        queryGridUrl: "/nccloud/uapbd/ref/CostRegionDefaultGridRef.do",
        columnConfig: [
            { name: [langCheck('0000PUB-000032'), langCheck('0000PUB-000033')], code: ["refcode", "refname"] }/* 国际化处理： 编码,名称*/
        ],
        isMultiSelectedEnabled: false
    };

    return <Refer {...Object.assign(conf, props)} />;
}

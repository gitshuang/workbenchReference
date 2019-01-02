import React from "react";
import { high } from "nc-lightapp-front";
import {langCheck} from "Pub/js/utils";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        queryTreeUrl: "/nccloud/riart/ref/bdmdEntityAndEnumRefTreeAction.do",
        queryGridUrl: "/nccloud/riart/ref/bdmdEntityAndEnumRefTableAction.do",
        rootNode: { refname: langCheck('0000PUB-000046'), refpk: "root" },/* 国际化处理： 元数据*/
        columnConfig: [
            {
                name: [langCheck('0000PUB-000047'),langCheck('0000PUB-000048')],/* 国际化处理： 实体编码,实体名称*/
                code: ["refcode", "refname"]
            }
        ],
        refType: "gridTree",
        isMultiSelectedEnabled: true,
        isTreelazyLoad: false,
        refName: langCheck('0000PUB-000050')/* 国际化处理： 元数据主实体和枚举*/
    };

    return <Refer {...Object.assign(conf, props)} />;
}

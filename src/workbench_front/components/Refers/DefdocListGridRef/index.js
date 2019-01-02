import React from "react";
import { high } from "nc-lightapp-front";
import {langCheck} from "Pub/js/utils";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        refType: "grid",
        refName: langCheck('0000PUB-000061'),/* 国际化处理： 自定义档案定义*/
        placeholder: langCheck('0000PUB-000061'),/* 国际化处理： 自定义档案定义*/
        refCode: "uapbd.refer.userdef.DefdocListGridRef",
        queryGridUrl: "/nccloud/uapbd/userdef/DefdocListGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: [langCheck('0000PUB-000062'), langCheck('0000PUB-000063')],/* 国际化处理： 自定义档案编码,自定义档案名称*/
                code: ["code", "name"]
            }
        ]
    };

    return <Refer {...Object.assign(conf, props)} />;
}

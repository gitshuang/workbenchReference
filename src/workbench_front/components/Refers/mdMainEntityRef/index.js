import React from "react";
import { high } from "nc-lightapp-front";
import {langCheck} from "Pub/js/utils";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        queryTreeUrl: "/nccloud/riart/ref/mdmainEntityRefTreeAction.do",
        refType: "tree",
        isTreelazyLoad: false,
        refName: langCheck('0000PUB-000064'),/* 国际化处理： 元数据实体*/
        rootNode: { refname: langCheck('0000PUB-000046'), refpk: "root" }/* 国际化处理： 元数据*/
    };

    return <Refer {...Object.assign(conf, props)} />;
}

import React from "react";
import { high } from "nc-lightapp-front";
import {langCheck} from "Pub/js/utils";
const { Refer } = high;

export var conf = {
    placeholder: langCheck('0000PUB-000052'),/* 国际化处理： 业务单元+集团*/
    rootNode: { refname: langCheck('0000PUB-000052'), refpk: "root" },/* 国际化处理： 业务单元+集团*/
    refType: "tree",
    refName: langCheck('0000PUB-000053'),/* 国际化处理： 业务单元+集团参照*/
    refCode: "uapbd.org.BusinessUnitAndGroupTreeRef",
    queryTreeUrl: "/nccloud/uapbd/ref/BusinessUnitAndGroupTreeRef.do",
    treeConfig: { name: [langCheck('0000PUB-000032'), langCheck('0000PUB-000033')], code: ["refcode", "refname"] },/* 国际化处理： 编码,名称*/
    isMultiSelectedEnabled: false,
    unitProps: {
        queryTreeUrl: "/nccloud/riart/ref/groupRefTreeAction.do",
        refType: "tree",
        //isMultiSelectedEnabled:true
        refName: langCheck('0000PUB-000054'),/* 国际化处理： 集团*/
        rootNode: { refname: langCheck('0000PUB-000054'), refpk: "root" }/* 国际化处理： 集团*/
    },
    isShowUnit: false
};

export default function(props = {}) {
    return <Refer {...Object.assign(conf, props)} />;
}

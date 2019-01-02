import React from "react";
import { high } from "nc-lightapp-front";
import {langCheck} from "Pub/js/utils";
const { Refer } = high;

export var conf = {
    refType: "tree",
    refName: langCheck('0000PUB-000055'),/* 国际化处理： 业务单元*/
    refCode: "uapbd.refer.org.BusinessUnitTreeRef",
    rootNode: { refname: langCheck('0000PUB-000055'), refpk: "root" },/* 国际化处理： 业务单元*/
    placeholder: langCheck('0000PUB-000055'),/* 国际化处理： 业务单元*/
    queryTreeUrl: "/nccloud/uapbd/org/BusinessUnitTreeRef.do",
    treeConfig: { name: [langCheck('0000PUB-000032'), langCheck('0000PUB-000033')], code: ["refcode", "refname"] },/* 国际化处理： 编码,名称*/
    isMultiSelectedEnabled: false,
    isShowUnit: false,
    queryCondition: () => {
        return {
            TreeRefActionExt:
                "nccloud.web.platform.workbench.ref.filter.OrgRefPermissionFilter"
        };
    }
    // unitProps:{
    //     queryTreeUrl: "/nccloud/riart/ref/groupRefTreeAction.do",
    //     refType: "tree",
    //     //isMultiSelectedEnabled:true
    //     refName: "集团",
    //     rootNode: { refname: "集团", refpk: "root" }
    // }
};

export default function(props = {}) {
    return <Refer {...Object.assign(conf, props)} />;
}

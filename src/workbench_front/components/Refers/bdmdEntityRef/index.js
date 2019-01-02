import React from 'react';
import { high } from 'nc-lightapp-front';
import { langCheck } from 'Pub/js/utils';
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        queryTreeUrl: '/nccloud/riart/ref/bdmdEntityRefTreeAction.do',
        queryGridUrl: '/nccloud/riart/ref/bdmdEntityRefTableAction.do',
        rootNode: { refname: langCheck('0000PUB-000046'), refpk: 'root' } /* 国际化处理： 元数据*/,
        columnConfig: [
            {
                name: [ langCheck('0000PUB-000047'), langCheck('0000PUB-000048') ] /* 国际化处理： 实体编码,实体名称*/,
                code: [ 'name', 'displayName' ]
            }
        ],
        refType: 'gridTree',
        isMultiSelectedEnabled: true,
        isTreelazyLoad: false,
        refName: langCheck('0000PUB-000049') /* 国际化处理： 档案元数据实体*/
    };

    return <Refer {...Object.assign(conf, props)} />;
}

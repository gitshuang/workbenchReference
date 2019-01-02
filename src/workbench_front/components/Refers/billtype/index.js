import React from 'react';
import { high } from 'nc-lightapp-front';
import { langCheck } from 'Pub/js/utils';
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        refType: 'grid',
        refName: langCheck('0000PUB-000051') /* 国际化处理： 单据类型*/,
        placeholder: langCheck('0000PUB-000051') /* 国际化处理： 单据类型*/,
        refCode: 'riart.refer.pub.allBillTypeGridRef',
        queryGridUrl: '/nccloud/riart/ref/allBillRef.do',
        isMultiSelectedEnabled: false,
        columnConfig: [
            { name: [ langCheck('0000PUB-000032'), langCheck('0000PUB-000033') ], code: [ 'refcode', 'refname' ] }
        ] /* 国际化处理： 编码,名称*/
    };

    return <Refer {...Object.assign(conf, props)} />;
}

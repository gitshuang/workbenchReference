import { Component } from 'react';
import Ref from './refer';
import {langCheck} from "Pub/js/utils";
export default function(props = {}) {
    var conf = {
        queryTreeUrl: '/nccloud/riart/ref/userRefTreeAction.do',
        queryGridUrl: '/nccloud/riart/ref/userRefTableAction.do',
        rootNode: { refname: langCheck('0000PUB-000065'), refpk: 'root' } /* 国际化处理： 用户*/,
        columnConfig: [
            {
                name: [
                    langCheck('0000PUB-000032'),
                    langCheck('0000PUB-000033'),
                    langCheck('0000PUB-000066'),
                    langCheck('0000PUB-000067')
                ] /* 国际化处理： 编码,名称,所属用户组,所属组织*/,
                code: [ 'refcode', 'refname', 'groupname', 'name' ]
            }
        ],
        queryCondition: {
            roleRefClassType: 'pk_usergroup',
            group_pk: 'firstGroup'
        },
        treeConfig: {
            name: [ langCheck('0000PUB-000032'), langCheck('0000PUB-000033') ],
            code: [ 'refcode', 'refname' ]
        } /* 国际化处理： 编码,名称*/,
        isMultiSelectedEnabled: true,
        refType: 'gridTree',
        refName: langCheck('0000PUB-000068') /* 国际化处理： 用户参照*/,
        unitProps: {
            rootNode: { refname: langCheck('0000PUB-000054'), refpk: 'root' } /* 国际化处理： 集团*/,
            refName: langCheck('0000PUB-000054') /* 国际化处理： 集团*/,
            refCode: 'pk_group',
            queryTreeUrl: '/nccloud/riart/ref/groupRefTreeAction.do',
            refType: 'tree',
            pageSize: 50,
            isCacheable: true,
            placeholder: langCheck('0000PUB-000054') /* 国际化处理： 集团*/,
            refType: 'tree',
            treeConfig: {
                name: [ langCheck('0000PUB-000032'), langCheck('0000PUB-000033') ],
                code: [ 'refcode', 'refname' ]
            } /* 国际化处理： 编码,名称*/
        },
        isShowUnit: false
    };

    class RadioChange extends Component {
        constructor(props) {
            super(props);
            this.state = {
                value: { refname: langCheck('0000PUB-000069'), refpk: 'root' } /* 国际化处理： 用户组*/
            };
        }

        rRadioOnChange = (radioValue) => {
            let _this = this;
            let values = {};
            if (radioValue == 'pk_usergroup') {
                values = { refname: langCheck('0000PUB-000069'), refpk: 'root' }; /* 国际化处理： 用户组*/
            } else if (radioValue == 'pk_dept') {
                values = { refname: langCheck('0000PUB-000070'), refpk: 'root' }; /* 国际化处理： 部门*/
            } else {
                values = { refname: langCheck('0000PUB-000067'), refpk: 'root' }; /* 国际化处理： 所属组织*/
            }
            _this.setState(
                {
                    value: values
                },
                () => {
                    _this.render();
                }
            );
        };

        render() {
            let _this = this;
            return <Ref {..._this.props} rootNode={_this.state.value} rRadioOnChange={_this.rRadioOnChange} />;
        }
    }

    return <RadioChange {...Object.assign(conf, props)} />;

    // return <Ref {...Object.assign(conf, props)} />
}

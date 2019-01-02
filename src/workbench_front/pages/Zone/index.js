import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { setZoneData, setZoneTempletid, setNewList, clearData, setJson } from 'Store/Zone/action';
import Ajax from 'Pub/js/ajax';
import ModuleFromCard from './ModuleFromCard';
import { PageLayout } from 'Components/PageLayout';
import Notice from 'Components/Notice';
import ZoneTable from './ZoneTable';
import MyBtns from './MyBtns';
import Myhead from './Myhead';
import { GetQuery, langCheck } from 'Pub/js/utils';
import { getMulti } from 'Pub/js/getMulti';
import './index.less';

/**
 * 区域配置页面 
 */
class ZoneRegister extends Component {
    constructor(props) {
        super(props);
    }
    componentWillUnmount() {
        this.props.clearData();
    }
    componentWillMount() {
        let callback = (json) => {
            this.props.setJson(json);
        };
        getMulti({
            moduleId: '102202APP',
            domainName: 'workbench',
            callback
        });
    }
    componentDidMount() {
        let { json } = this.props;
        let param = GetQuery(this.props.location.search);
        this.props.setZoneTempletid(param.templetid);
        let url, data;
        url = '/nccloud/platform/templet/queryallarea.do';
        data = {
            templetid: param && param.templetid
        };
        if (param.templetid) {
            Ajax({
                url: url,
                data: data,
                info: {
                    name: langCheck('102202APP-000003', "pages", json) /* 国际化处理： 区域设置*/,
                    action: langCheck('102202APP-000004', "pages", json) /* 国际化处理： 传递区域数值*/
                },
                success: ({ data }) => {
                    if (data.success && data.data) {
                        this.props.setZoneData(data.data);
                        this.props.setNewList(data.data.areaList);
                    } else {
                        Notice({ status: 'error', msg: data.data.true });
                    }
                }
            });
        }
    }

    render() {
        return (
            <PageLayout className='nc-workbench-zone'>
                <Layout>
                    <Myhead />
                    <MyBtns />
                    <ModuleFromCard />
                    <ZoneTable />
                </Layout>
            </PageLayout>
        );
    }
}
export default connect(
    (state) => ({
        json: state.zoneRegisterData.json
    }),
    {
        setZoneData,
        setZoneTempletid,
        setNewList,
        clearData,
        setJson
    }
)(ZoneRegister);

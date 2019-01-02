import React from "react";
import AllApps from "./AllApps/index";
import { Popover } from "antd";
import {langCheck} from "Pub/js/utils";
class AllAppBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allAppsVisible: false,
            num: 0  //增加监听事件的标志位
        };
    }
    
    clickAllApply = () => {
        if(this.state.num == 0) {
            this.setState({
                num: 2
            });
            console.log(111)
            if(document.getElementById('mainiframe')){
                //iframe点击事件
                document.getElementById('mainiframe').contentDocument.addEventListener("mouseup",(e) => {
                    console.log(333)
                    if(this.state.allAppsVisible) {
                        document.getElementById('allApplyIcon').click();
                    }
                });
            }
        }
    }
    //移出监听事件
    componentWillUnmount () {
        document.getElementById('mainiframe').contentDocument.removeEventListener("mouseup",(e) => {
            if(this.state.allAppsVisible) {
                document.getElementById('allApplyIcon').click();
            }
        });
    }
    render() {
        let { allAppsVisible } = this.state;
        return (
            <div className="margin-right-20"
                onClick={this.clickAllApply}
            >
                <Popover
                    overlayClassName="all-apps-popover"
                    content={<AllApps />}
                    placement="bottomRight"
                    arrowPointAtCenter={true}
                    align={{
                        offset: [200, 0]
                    }}
                    onVisibleChange={isVisible => {
                        this.setState({
                            allAppsVisible: isVisible
                        });
                    }}
                    trigger="click"
                >
                    <i
                        title={langCheck('0000PUB-000100')}/* 国际化处理： 全部应用*/
                        field="application"
                        fieldname={langCheck('0000PUB-000100')}/* 国际化处理： 全部应用*/
                        className={
                            allAppsVisible
                                ? "iconfont icon-quanbuyingyong allApplyColor"
                                : "iconfont icon-quanbuyingyong"
                        }
                        id='allApplyIcon'
                    />
                </Popover>
            </div>
        );
    }
}
export default AllAppBtn;

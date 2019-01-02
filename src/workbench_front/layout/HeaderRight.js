import React from "react";
import SearchApp from "./headerComponents/SearchApp";
import AllAppBtn from "./headerComponents/AllAppBtn";
import IM from "./headerComponents/IM";
import RecordSPR from "./headerComponents/RecordSPR";
import MTZBDate from "./headerComponents/MTZBDate";
/**
 * workbench 工作桌面头部右侧集合
 */
class HeaderRight extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="n-v-middle n-right right-block">
                <div className='container'>
                    <SearchApp />
                    <AllAppBtn />
                    {this.props.shouldShowIm ? <IM />: null}
                    <RecordSPR />
                </div>
                <span className='block-span'/>
                <div>
                    <MTZBDate />
                </div>
            </div>
        );
    }
}
export default HeaderRight;


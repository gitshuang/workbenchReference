import React, { Component } from "react";
import PropTypes from "prop-types";
import "./index.less";
/**
 * 工作桌面中页面布局组件
 * @param {Number} height 距离浏览器顶部的距离
 */
let isMouseDown = false;
/**
 * 单页基本布局容器
 */
class PageLayout extends Component {
    static defaultProps = {
        className: ""
    };
    constructor(props) {
        super(props);
    }
    handleMouseUp = () => {
        isMouseDown = false;
    };
    handleMouseMove = e => {
        if (isMouseDown) {
            let mouseLeft = e.clientX;
            let layoutLeft = document.querySelector("#layoutLeft");
            let blockLeft = layoutLeft.getBoundingClientRect().left;
            // console.log(blockLeft);
            let w = parseInt(mouseLeft - blockLeft) + 3;
            if (w < 200) {
                return;
            } else {
                layoutLeft.style.width = `${w}px`;
            }
        } else {
            return;
        }
    };
    render() {
        return (
            <div className="nc-workbench-page">
                {this.props.header ? this.props.header : null}
                <div
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.handleMouseUp}
                    className={`nc-workbench-ownpage ${
                        this.props.children.length === 2
                            ? "nc-workbench-ownpage-all"
                            : ""
                    } ${this.props.className}`}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }
}
/**
 * 单页滚动基本布局容器
 */
class PageScrollLayout extends Component {
    static defaultProps = {
        className: ""
    };
    constructor(props) {
        super(props);
        this.state = {
            suck: false
        };
        this.initScrollContainerTop;
    }
    handleMouseUp = () => {
        isMouseDown = false;
    };
    handleMouseMove = e => {
        if (isMouseDown) {
            let mouseLeft = e.clientX;
            let layoutLeft = document.querySelector("#layoutLeft");
            let blockLeft = layoutLeft.getBoundingClientRect().left;
            let w = parseInt(mouseLeft - blockLeft) + 3;
            if (w < 200) {
                return;
            } else {
                layoutLeft.style.width = `${w}px`;
            }
        } else {
            return;
        }
    };
    handleScroll = e => {
        let { y, width } = this.refs[
            "ncWorkbenchPageScroll"
        ].getBoundingClientRect();
        // console.log(y, width);
        // console.log(this.initScrollContainerTop);
        if (y == this.initScrollContainerTop) {
            this.setState({
                suck: false
            });
        }
        if (y < this.initScrollContainerTop) {
            if (this.state.suck) {
                return;
            }
            this.containerWidthChange();
            this.setState({
                suck: true
            });
        }
    };
    containerWidthChange = () => {
        let { width } = this.refs[
            "ncWorkbenchPageOwnpage"
        ].getBoundingClientRect();
        document.getElementById(
            "ncWorkbenchPageHeader"
        ).style.width = `${width}px`;
        document.getElementById("suckTableHeader").style.width = `${width}px`;
    };
    componentDidMount() {
        window.addEventListener("resize", this.containerWidthChange);
        let { y } = this.refs["ncWorkbenchPageScroll"].getBoundingClientRect();
        this.initScrollContainerTop = y;
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.containerWidthChange);
    }
    render() {
        let suck = this.state.suck;
        return (
            <div
                className="nc-workbench-page-scroll"
                onScroll={this.handleScroll}
            >
                <div className=" nc-workbench-page ">
                    <div
                        className={`nc-workbench-page-container ${
                            suck ? "nc-workbench-suck" : ""
                        }`}
                        ref="ncWorkbenchPageScroll"
                    >
                        {this.props.header ? this.props.header : null}
                        <div
                            onMouseMove={this.handleMouseMove}
                            onMouseUp={this.handleMouseUp}
                            ref="ncWorkbenchPageOwnpage"
                            className={`nc-workbench-ownpage ${
                                this.props.children.length === 2
                                    ? "nc-workbench-ownpage-all"
                                    : ""
                            } ${this.props.className}`}
                        >
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
/**
 * 单页左侧基本布局容器
 */
class PageLayoutLeft extends Component {
    static defaultProps = {
        className: ""
    };
    constructor(props) {
        super(props);
    }
    handleMouseDown = () => {
        isMouseDown = true;
    };

    render() {
        return (
            <div
                id="layoutLeft"
                className={`nc-workbench-ownpage-left ${this.props.className}`}
            >
                <span
                    className="layout-drag-block"
                    onMouseDown={this.handleMouseDown}
                />
                {this.props.children}
            </div>
        );
    }
}
/**
 * 单页左侧基本布局容器
 */
class PageLayoutHeader extends Component {
    static defaultProps = {
        className: ""
    };
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div
                id="ncWorkbenchPageHeader"
                className={`nc-workbench-page-header ${this.props.className}`}
            >
                {this.props.children}
            </div>
        );
    }
}
/**
 * 单页右侧基本布局容器
 */
class PageLayoutRight extends Component {
    static defaultProps = {
        className: ""
    };
    render() {
        return (
            <div
                className={`nc-workbench-ownpage-right ${this.props.className}`}
            >
                {this.props.children}
            </div>
        );
    }
}

PageLayout.propTypes = {
    // breadcrumb: PropTypes.array,
    children: PropTypes.any.isRequired
};
PageLayoutLeft.propTypes = {
    // breadcrumb: PropTypes.array,
    children: PropTypes.any.isRequired
};
PageLayoutRight.propTypes = {
    // breadcrumb: PropTypes.array,
    children: PropTypes.any.isRequired
};

export {
    PageLayout,
    PageScrollLayout,
    PageLayoutHeader,
    PageLayoutLeft,
    PageLayoutRight
};

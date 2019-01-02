import React, { Component } from "react";
import "./index.less";
import { DropTarget } from "react-dnd";
import { connect } from "react-redux";
import { Link } from "react-scroll";
//锚点区域组件类
class MyContentAnchor extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { groups } = this.props;
        return (
            <div className="content-anchor">
                {groups.map((g, i) => {
                    return (
                        <AnchorLi
                            onCardListDropInGroupItem={
                                this.props.onCardListDropInGroupItem
                            }
                            key={g.pk_app_group}
                            id={g.pk_app_group}
                            index={i}
                            name={g.groupname}
                        />
                    );
                })}
            </div>
        );
    }
}
export default connect(
    state => ({
        groups: state.templateDragData.groups
    }),
    {}
)(MyContentAnchor);

const anchorTarget = {
    //拖拽siderCard释放锚点区域
    drop(props, monitor, component) {
        const dragItem = monitor.getItem();
        const dropItem = props;
        if (dragItem.type === "cardlist") {
            props.onCardListDropInGroupItem(dragItem, dropItem);
        }
    },
    //只可以释放siderCard区域的卡片
    canDrop(props, monitor) {
        // You can disallow drop based on props or item
        //retutrn false,则monitor.didDrop()为undefined
        const dragItem = monitor.getItem();
        if (dragItem.type === "cardlist") {
            return true;
        } else {
            return false;
        }
    }
};

@DropTarget("item", anchorTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
}))
//锚点组件类
class AnchorLi extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    /**
     * 当锚点名称、下标、拖拽hover变化时，重新渲染
     */
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.name !== nextProps.name) {
            return true;
        }
        if (this.props.index !== nextProps.index) {
            return true;
        }
        if (this.props.isOver !== nextProps.isOver) {
            return true;
        }
        return false;
    }
    render() {
        const { connectDropTarget, isOver, name, id } = this.props;
        return connectDropTarget(
            <span
                className="anchor"
                style={{ background: isOver ? "rgb(204, 204, 204)" : "" }}
            >
                <Link
                    activeClass="active"
                    to={`a${id}`}
                    offset={-139}
                    spy={true}
                    smooth={true}
                    duration={250}
                    containerId="nc-workbench-desktop-container"
                >
                    {name}
                    <span />
                </Link>
            </span>
        );
    }
}

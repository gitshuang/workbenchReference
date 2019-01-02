import React, { Component } from "react";
import appIcons from "Pub/js/appIcons";
class ImgList extends Component {
    static defaultProps = {
        isedit: true
    };
    constructor(props) {
        super(props);
    }
    handleSelect = item => {
        this.props.onSelected(item);
    };
    createIconList = iconList => {
        return iconList.map(item => {
            let { name, src, selected } = item;
            return (
                <li key={src}>
                    <div
                        title={name}
                        onClick={() => {
                            this.handleSelect(item);
                        }}
                    >
                        {src.indexOf("/") === -1 ? (
                            <div
                                className={`icon ${
                                    selected ? "img-selected" : ""
                                }`}
                                style={{
                                    background: `url(${
                                        appIcons[src]
                                    }) no-repeat 0px 0px`,
                                    backgroundSize: "contain"
                                }}
                            />
                        ) : (
                            <img width="80" src={src} alt={name} />
                        )}
                        <div className="icon-title">{name}</div>
                    </div>
                </li>
            );
        });
    };
    render() {
        const { title, iconList } = this.props.iconListData;
        return (
            <div className="choose-imgae-list">
                <div className="title">{title}</div>
                <ul>{this.createIconList(iconList)}</ul>
            </div>
        );
    }
}
export default ImgList;

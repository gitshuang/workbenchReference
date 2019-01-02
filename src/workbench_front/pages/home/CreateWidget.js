import React, { Component } from "react";
class CreateWidget extends Component {
    constructor(props) {
        super(props);
    }
    createWidgetDom = () => {
        let widget = document.createElement("iframe");
        widget.setAttribute("field", "app-item");
        widget.setAttribute("fieldname", this.props.name);
        widget.setAttribute("cid", this.props.cardId);
        widget.style.width = "100%";
        widget.style.height = "100%";
        widget.frameBorder = "0";
        widget.scrolling = "no";
        // widget.className = "app-item";
        this.refs[this.props.cardId].appendChild(widget);
        let widgetDoc = widget.contentWindow.document;
        widgetDoc.open().write(
            `<body onload="window.location.href='${this.props.src}';">`
        );
        widgetDoc.close();
    };
    // componentDidUpdate(prevProps, prevState) {
    //     if (this.refs[this.props.cardId].children.length > 0) {
    //         return;
    //     }
    //     this.createWidgetDom();
    // }
    componentDidMount() {
        if (this.refs[this.props.cardId].children.length > 0) {
            return;
        }
        this.createWidgetDom();
    }
    render() {
        return (
            <div
                className="grid-item"
                key={this.props.cardId}
                style={this.props.style}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden"
                    }}
                    ref={this.props.cardId}
                    className="app-item"
                />
            </div>
        );
    }
}
export default CreateWidget;

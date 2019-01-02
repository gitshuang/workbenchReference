import React,{Component} from 'react';
class Svg extends Component{
    constructor(props) {
        super(props);
        
    }
    render() {
        return (
            <svg className="icon" style={{"width":`${this.props.width}px`,height:`${this.props.height}px`}} aria-hidden="true">
                <use xlinkHref={this.props.xlinkHref}></use>
            </svg>
        );
    }
}
export default Svg;
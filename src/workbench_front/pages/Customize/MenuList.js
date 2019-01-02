import React,{Component} from 'react';
class MenuListItem extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <li {...this.props}>{this.props.children}</li>
        );
    }
}
class MenuList extends Component{
    constructor(props) {
        super(props);
    }
    createList = (listArray)=>listArray.map((item,index)=>{
        return <MenuListItem className={`side-menu-li ${item.active?'side-menu-active':''}`} key={item.url} onClick={()=>{this.props.onClick(item.url)}}>{item.name}</MenuListItem>
    });
    render() {
        return (
            <ul className='side-menu-ul'>
                {this.createList(this.props.listArray)}        
            </ul>
        );
    }
}
export default MenuList;
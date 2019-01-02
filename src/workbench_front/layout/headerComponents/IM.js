import React from 'react';
import Ajax from '../../pub/js/ajax';
import { connect } from 'react-redux';
import {langCheck} from "Pub/js/utils";
class IM extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasImInit: false,
            loading: false,
            appOption: {},
            intelligentResponse: null,
            xiaoyouSendTime: '',
            hasBindEvent: false,
            hasSendOpenMsg: false
        }
    }
    // 动态添加IM的组件js
    appendSdk = (appSrc,url,nccContext) => {
        if(document.getElementById('imAppSrc')) {
            this.appendLoginIframe(url,nccContext);
            return;
        }
        let myScript = document.createElement("script");
        myScript.type = "text/javascript";
        myScript.id = "imAppSrc";
        // myScript.src = "https://mz-daily.yyuap.com/static/workbench_im/app.js";//daily环境
        // myScript.src = "https://mz.yonyoucloud.com/static/workbench_im/app.js";//正式环境
        myScript.src = appSrc;
        document.getElementsByTagName("head")[0].appendChild(myScript);
        myScript.onload = () => {
            this.appendLoginIframe(url,nccContext);
        }
    }
    // 加载登陆的iframe
    appendLoginIframe = (url,nccContext) => {
        if(document.getElementById('imxyframe')) {
            document.getElementsByTagName("head")[0].removeChild(document.getElementById('imxyFrame'));
        }
        // 如果iframe的src为null时候 不创建iframe.
        if(!url) {
            // this.toolInit(nccContext);
            return;
        }
        let loginIframeScr = document.createElement('iframe');      //创建iframe 
        loginIframeScr.src = url; 
        loginIframeScr.style.display = 'none';  
        loginIframeScr.id = 'imxyFrame'; 
        document.getElementsByTagName("head")[0].appendChild(loginIframeScr);   //将iframe标签嵌入到head中 
        
        
        if (loginIframeScr.attachEvent){          
            loginIframeScr.attachEvent("onload", function(){                    //如果为ie浏览器则页面加载完成后立即执行    
                this.toolInit(nccContext);
            });    
        } else {    
            loginIframeScr.onload = function(){
                this.toolInit(nccContext);
            }; 
            
        }
    }
    componentDidMount() {
        if(this.props.needBind) {
            return;
        }
        // this.appendSdk();
        this.login();
        this.rerender();
    }
    componentDidUpdate(prevProps,prevState) {
        // 优化绑定后im的初始化。之前多用了个更新im的属性。
        if((prevProps.needBind !== this.props.needBind) && !this.props.needBind) {
            // this.appendSdk();
            this.login();
            this.rerender();
        }
    }
    
    /**
     * 初始化im对话框
     */
    toolInit = (nccContext) => {
        const eventbus = (function() {
            let events = {};
        
            const isWhateType = (obj, type) => {
                return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type;
            }
            return {
                list: events,
                on: function(event, callback) {
                    if (isWhateType(event, 'string')) {
                        if (isWhateType(callback, 'function')) {
                            events[event] = events[event] || [];
                            let index = events[event].indexOf(callback);
                            if (index == -1) {
                                events[event].push(callback);
                            }
                        }
                    }
                },
                off: function(event, callback) {
                    if (isWhateType(event, 'string')) {
                        if (isWhateType(callback, 'function')) {
                            events[event] = events[event] || [];
                            let index = events[event].indexOf(callback);
                            if (index != -1) {
                                events[event].splice(index, -1);
                            }
                        }
        
                        if (isWhateType(callback, 'undefined')) {
                            events[event] = null;
                        }
                    }
        
                    if (isWhateType(event, 'undefined')) {
                        events = null;
                        events = {};
                    }
                },
                dispatch: function() {
                    if (arguments.length) {
                        const event = arguments[0];
                        if (isWhateType(event, 'string') && events[event]) {
                            const params = Array.prototype.splice.call(arguments, 1, arguments.length);
        
                            for (let x in events[event]) {
                                if (events[event].hasOwnProperty(x)) {
                                    try {
                                        events[event][x].apply(null, params);
                                    } catch (error) {
                                        console.log('EventHandleError.', error);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })();

        let context = {
            appcode: "nccloud",
            // locale: "zh_CN",
            tenantid: nccContext.tenantId,
            // token: nccContext.token,
            // username: "",
            // "theme": "", 
            // "username": "", 
            // "timezone": "" ,
            // userid: "c4b63717-e651-47c4-9e7b-e4e7d88293ec",
            // "token": "c4b63717-e651-47c4-9e7b-e4e7d88293ec",
            // token: "e63cdd27-cc2d-411e-8d7a-2eb18143b251", //小友daily环境
            // token: "96b00f22-7267-45da-8cd7-4a8d8b70f5c5", //小友正式环境
            token: nccContext.token
        }
        const config = {
            el: 'messageContainer'
        }
        
        if(this.state.hasImInit) {
            return;
        }
        
        InitEsnIM(eventbus, context, config);

        this.xiaoyouOpenApp(eventbus);
        this.ImTool = eventbus;
        this.setState({
            hasImInit: true
        })
    }
    /**
     * 通过小友打开单据 
     */
    xiaoyouOpenApp = (tool) => {
        let hidden;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
            hidden = "hidden";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
        }

        tool.on('onReceivedMessage',(msg)=>{
            let intelligentResponse = JSON.parse(JSON.parse(msg.data.extend).intelligentResponse);
            
            let {entity, word, pointcode,is_cloud_app} = intelligentResponse;
            // 判断是否为打开应用节点
            if(entity === 'openPoint' || entity === 'form') {
                let appOption = {
                    name: word,
                    appcode: pointcode,
                    is_cloud_app: is_cloud_app
                }
               
                if(!document[hidden]) {  
                    this.setState({
                        appOption: {...appOption},
                        intelligentResponse:{...intelligentResponse},
                        xiaoyouSendTime: new Date().getTime(),
                        hasSendOpenMsg: true
                    })
                }

            } else {
                this.setState({
                    hasSendOpenMsg: false
                })
            }
        })
    }



    /**
     * 登陆
     */
    login = () => {
        Ajax({
            url: '/nccloud/platform/login/loginyhtanddiwork.do',
            info: {
                name: langCheck('0000PUB-000111'),/* 国际化处理： im消息*/
                appcode: "10228888",
                action: langCheck('0000PUB-000112')   /* 国际化处理： im登陆*/
            },
            success: function ( { data }) {
                let { login_url,
                  im_url,
                  xiaoyou_token   
                } =  data.data;
                let url = login_url || '';
                const getQueryByName = (url,name) => {
                    var reg = new RegExp('[?]'+name+'=([^&#]+)');
                    var query = url.match(reg);
                    return query?query[1]:null;
                }
                let nccContext = {
                    token: xiaoyou_token || '',
                    tenantId: getQueryByName(url,'tenantId') || ''
                }
                // 动态加载im的js文件并创建登陆的iframe
                this.appendSdk(im_url,url,nccContext);

            }.bind(this)
        })
        
    }
    /**
     * im消息中心 
     */
    handleImXiaoxi = (e) => {
        try {
            const imDiv = document.getElementById("ykj-frame");
            const selectMemberDiv = document.getElementsByClassName('fs-select-member-dialog')[0];
            const getStyle = (obj,attr) => {
                return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr]
            }
            e.nativeEvent.stopImmediatePropagation();
            let imShow = getStyle(imDiv,'display');
            if(imShow === 'none') {
                this.ImTool.dispatch('imShow');
            }
            // iframe点击处理
            if(document.getElementById('mainiframe')){
                document.getElementById('mainiframe').contentDocument.addEventListener("mouseup",(e) => {
                    this.ImTool.dispatch('imHide');
                })
            }
            if(this.state.hasBindEvent) {
                return;
            }
            // 小友组件之外点击 隐藏小友功能
            document.addEventListener("mouseup",(e) => {
                if(!imDiv.contains(e.target)){
                    if(typeof selectMemberDiv !== 'undefined' && selectMemberDiv.contains(e.target)){
                        return;
                    }
                    this.ImTool.dispatch('imHide');
                }
            });
            // 防止浏览器屏蔽弹窗增加事件处理
            document.addEventListener('click',(e)=> {
                if(e.target === document.getElementsByClassName('sendmsg')[0]) {
                    setTimeout(() => {
                        if(this.state.hasSendOpenMsg) {
                            // window.openNew({name: "部门", appcode: "10100DEPT", is_cloud_app: false},true);
                            window.openNew(this.state.appOption,true,JSON.stringify(this.state.intelligentResponse));
                            this.setState({
                                hasSendOpenMsg: false
                            })
                        }
                    }, 500);
                }
            })
            document.addEventListener('keydown',(event)=>{
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if(e && e.keyCode==13 ){
                    setTimeout(() => {
                        if(this.state.hasSendOpenMsg) {
                            // window.openNew({name: "部门", appcode: "10100DEPT", is_cloud_app: false},true);
                            window.openNew(this.state.appOption,true,JSON.stringify(this.state.intelligentResponse));
                            this.setState({
                                hasSendOpenMsg: false
                            })
                        }
                        
                    }, 500);
                }
            });
            this.setState({
                hasBindEvent: true
            }) 
            
            
        } catch (error) {
            this.setState({
                loading: true
            })
            setTimeout(() => {
               this.setState({
                   loading: false
               })
               document.getElementsByClassName('icon-xiaoxi')[0].click();
            }, 3000);
        }
    }
    // 每隔50分钟要重新请求login一次 防止im的session失效
    rerender() {
        if(this.reRenderHander){
            clearTimeout(this.reRenderHander);
        }
        this.reRenderHander = setTimeout(() => {
            this.login();
        },50 * 60 * 1000);
    }
    render() {
        let realEle = null;
        let xiaoxiElement = (
                <i
                    onClick={this.handleImXiaoxi}
                    field="message"
                    fieldname={langCheck('0000PUB-000113')}/* 国际化处理： 消息*/
                    className={"iconfont icon-xiaoxi"}
                />
               
        )
        let loadingElement = (
                <div class="loader-inner ball-clip-rotate">
                    <div></div>
                </div>
        )
        this.state.loading ? realEle = loadingElement : realEle = xiaoxiElement;
            return (
                <div className="margin-right-20 im" >
                    {realEle}
                    <div>
                        <div id="messageContainer"></div>
                    </div>
                </div>
            )
    }
}

// export default IM;
export default connect(
    (state) => ({
        needBind: state.appData.needBind
    })
)(IM);

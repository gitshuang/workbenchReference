/*
* NCPE is a singleton to track user click events,then batch sync the logs to cloud.
* Dependency:None.
* todo list:
* 1.actionName :nodename-btnname
* 2.logQuene tunning(variable or sessionStorage)(LogQuene,LogQuene2)
* 3.how to get userid.$ncpe.userid=??
* 4.how to configure projectcode(as well as other parameters) of nlink easily--a configure file is the best.($ncpe.projectcode=???)
* (3,4 should get be inited by  login and logout.)
* 5.register event handle for window close.(to call $NCPE.commit())
*/
/*
    * quene based on sessionStorage.
    * if the application open more than one window, sessionStorage is not suitable.
     */
function LogQuene_local() {
    this.getQuene = () => JSON.parse(localStorage.getItem("pelog")) || [];
    this.isEmpty = () => {
        return this.getQuene().length == 0;
    };
    this.push = log => {
        let quene = this.getQuene();
        quene.push(log);
        localStorage.setItem("pelog", JSON.stringify(quene));
    };
    this.poll = () => {
        let writeQuene = this.getQuene().slice(0);
        localStorage.removeItem("pelog");
        return writeQuene;
    };
    this.size = () => this.getQuene().length;
}
/*
                * quene based on sessionStorage.
                * if the application open more than one window, sessionStorage is not suitable.
                 */
function LogQuene() {
    this.getQuene = () => JSON.parse(sessionStorage.getItem("pelog")) || [];
    this.isEmpty = () => {
        return this.getQuene().length == 0;
    };
    this.push = log => {
        let quene = this.getQuene();
        quene.push(log);
        sessionStorage.setItem("pelog", JSON.stringify(quene));
    };
    this.poll = () => {
        let writeQuene = this.getQuene().slice(0);
        sessionStorage.removeItem("pelog");
        return writeQuene;
    };
    this.size = () => this.getQuene().length;
}
var LogQuene_local = new LogQuene_local();
var logQuene = new LogQuene();
/*
        * gloabal variable.
        */
if (!$NCPE) {
    var $NCPE = new NCPE();
    if (!LogQuene_local.isEmpty()) {
        $NCPE.commit_local();
    }
    /*
            * sync everty half an hour.
            */
    setInterval($NCPE.commit, 15 * 60 * 1000);
}
let curAction = "";
// let allRemote = new Array();
//remotecall times.
let remotecalls = 0;

function NCPE() {
    let isLog = true;

    if (typeof Storage == "undefined") {
        //session storage is not supported by the browser.
        isLog = false;
    }

    // console.log('$ncpe is supported:' + isLog);
    let currevent = {};
    /*init env,userid,can be init $ncpe['userid']=??,$ncpe['projectcode']=??*/
    this.userid = "nctest";
    this.projectcode = "nccloud";
    this.lastAction = "";

    // 改为通过 window.peData.nlinkUrl 进行传入
    // const NLINKURL = 'http://123.103.9.190:17752';
    // const NLINKURL = "http://127.0.0.1:7760/";
    /* init context*/
    let context = this;

    //record and hanle log entries.try if it would work while let logQuene=new LogQuene2()
    // let logQuene = new LogQuene();
    let failTimes = 0;

    /*
            * funcname: the top layer of the click servs.eg.凭证-保存
            */
    function PE_TouchPoint(actionName) {
        /*
                *funcname is related to page context.
                *this need to parsed from actionName,or set property seperately.
                *default use actionName,but it should be refined later.
                */
        this.funName = encodeURI(window.peData.nodeName, "UTF-8");
        /*
                *busiAction is the clicked element value .
                */
        this.busiAction = encodeURI(actionName, "UTF-8");

        this.startTs = Date.now();
        this.endTs = Date.now();
        this.toString = () => {
            var COSTTIME = this.endTs - this.startTs;
            return (
                "projectcode:" +
                window.peData.projectCode +
                ";nodename:" +
                this.funName +
                ";busiaction:" +
                this.busiAction +
                ";costtime:" +
                COSTTIME +
                ";userid:" +
                window.peData.userID +
                ";opts:" +
                this.startTs +
                ";dr:" +
                remotecalls +
                ";nodeCode:" +
                window.peData.nodeCode
            );
        };
    }

    /*
           * quene based on Array.
           */
    function LogQuene2() {
        this.logArr = [];
        this.isEmpty = () => {
            return this.logArr.length == 0;
        };
        this.push = log => {
            this.logArr.push(log);
        };
        this.poll = () => {
            let writeQuene = this.logArr.slice(0);
            this.logArr.length = 0;
            return writeQuene;
        };
        this.size = () => this.logArr.length;
    }
    /*
            * add touchpoint to the logQuene.
            * when log entries is up to 20,
            * then sync to cloud by batch.
            */
    function addLog(touchPoint) {
        if (!isLog) {
            return;
        }
        if (touchPoint == null || touchPoint == undefined) {
            return;
        }
        logQuene.push(touchPoint.toString());
        // console.log(touchPoint.toString());
        // console.log('quene length:' + logQuene.size());
        if (logQuene.size() >= 10) {
            this.commit();
        }
    }

    /*
            *sync data to cloud.
            *it should be called when logout as not to lose any data.
            */
    this.commit = function() {
        if (!isLog) {
            return;
        }
        if (logQuene.isEmpty()) {
            return;
        }
        let writeQuene = logQuene.poll();
        //batch sync to cloud
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", window.peData.nlinkUrl, true);
        /*stop logging in case of network error.*/
        xhttp.onerror = () => {
            // console.log('commit pe error,failtimes=' + failTimes);
            failTimes++;
            if (failTimes > 3) {
                isLog = false;
                // console.log('network is error,set islog=false');
            }
        };
        xhttp.onload = () => {
            // console.log('sync over!');
        };
        /*content type should be cloud*/
        xhttp.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        xhttp.send("type=nc&log=" + writeQuene.join("\n"));
    };
    /*
            *sync data to cloud.
            *it should be called when logout as not to lose any data.
            */
    this.commit_local = function() {
        if (!isLog) {
            return;
        }
        if (LogQuene_local.isEmpty()) {
            return;
        }
        let writeQuene = LogQuene_local.poll();
        //batch sync to cloud
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", window.peData.nlinkUrl, true);
        /*stop logging in case of network error.*/
        xhttp.onerror = () => {
            // console.log('commit pe error,failtimes=' + failTimes);
            failTimes++;
            if (failTimes > 3) {
                isLog = false;
                // console.log('network is error,set islog=false');
            }
        };
        xhttp.onload = () => {
            // console.log('sync over!');
        };
        /*content type should be cloud*/
        xhttp.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        xhttp.send("type=nc&log=" + writeQuene.join("\n"));
    };
    /*
            *button is clicked
            */
    this.startAction = function(actionName) {
        //判断是否有没提交的业务动作
        if (curAction != "") this.endAction(curAction);
        this.lastAction = window.peData.nodeName + "-" + actionName;
        curAction = actionName;
        // allRemote = new Array();
        //reset remotecall times.
        remotecalls = 0;
        if (
            window.peData.projectCode == null ||
            window.peData.projectCode == "undefined" ||
            window.peData.nlinkUrl == null ||
            window.peData.nlinkUrl == "undefined" ||
            window.peData.nlinkUrl == ""
        ) {
            isLog = false;
            return;
        }
        if (actionName == null || actionName == "undefined") {
            return;
        }
        currevent[actionName] = new PE_TouchPoint(actionName);
    };
    /*
            *the event is handled over
            */
    this.endAction = function(actionName) {
        if (actionName == null || actionName == "undefined") {
            return;
        }
        if (currevent[actionName] != null) {
            // currevent[actionName].endTs = Date.now();
            addLog.call(this, currevent[actionName]);
            currevent[actionName] = null;
        }
        curAction = "";
    };
    /*
            * proxy of the event handler.
            * actioinName:凭证-保存
            */
    this.proxy = function(func, context, actionName) {
        if (func) {
            return function() {
                $NCPE.startAction(actionName);
                try {
                    func.call(context, ...arguments);
                } finally {
                    // $NCPE.endAction(actionName);
                }
            };
        }
    };

    /*
            *another way to proxy event handler.
            */
    this.proxyAction = (func, context, actionName) => (...arg) => {
        if (func) {
            $NCPE.startAction(actionName);
            try {
                func.call(context, ...arg);
            } finally {
                // $NCPE.endAction(actionName);
            }
        }
        // 判断是否为注销
        if (arg && arg[0] && arg[0].logout) {
            //判断是否有没提交的业务动作
            if (curAction != "") this.endAction(curAction);
            LogQuene_local.push(logQuene.getQuene());
            sessionStorage.removeItem("pelog");
            $NCPE.commit_local();
        }
    };

    /**加入远程调用url */
    this.startAjax = function(url) {
        if (curAction == null || curAction == "undefined" || curAction == "") {
            return;
        } 
        // else {
        //     allRemote.push(url);
        // }
        remotecalls++;
    };

    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };

    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    /**删除远程调用 */
    this.endAjax = function(url) {
        // if (allRemote.length == 0 || curAction == "") return;
        if (curAction == "") return;
        if (currevent[curAction] != null) {
            currevent[curAction].endTs = Date.now();
        }
        // allRemote.remove(url);
        //远程调用数组为空，调用endAction()
        // if (allRemote.length == 0) {
        //     $NCPE.endAction(curAction);
        // }
    };
}
window.addEventListener("beforeunload", function() {
    //判断是否有没提交的业务动作
    if (curAction != "") $NCPE.endAction(curAction);
    if (!logQuene.isEmpty()) {
        LogQuene_local.push(logQuene.getQuene());
        sessionStorage.removeItem("pelog");
    }
    // $NCPE.commit();
});

export default $NCPE;

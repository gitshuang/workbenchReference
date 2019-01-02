import { GetQuery, CreateQuery } from "./utils";
/**
 * 跳转方法
 * 包括 应用跳转、内部单页跳转
 */
/**
 * 应用打开
 * @param {String} appcode - 应用编码
 * @param {String} appid - 应用主键
 * @param {String} pagecode - 应用编码
 * @param {Object} win -  新页面 window
 * @param {String} query - 需要传递的参数
 * @param {Object} appInfo - 应用信息
 */
export const openApp = (
    win,
    appcode,
    appid,
    pagecode,
    type,
    query,
    appInfo
) => {
    /**
     * 应用信息
     * pageurl 页面url 地址
     * field 领域
     * module 模块
     * menuclass 菜单分类
     * menu 菜单
     */
    let {
        pageurl,
        menu: b4,
        menuclass: b3,
        module: b2,
        field: b1,
        is_cloud_app
    } = appInfo;
    if (is_cloud_app) {
        if (win) {
            // 浏览器新页签打开云集成应用
            win.location = pageurl;
            win.focus();
            return;
        }
    }
    if (
        appcode === "102202APP" ||
        appcode === "102202MENU" ||
        appcode === "1022PREGI" ||
        appcode === "10180TM" ||
        appcode === "10181TM" ||
        appcode === "101818AM"
    ) {
        type = "own";
    }
    b4 = encodeURIComponent(encodeURIComponent(b4));
    b3 = encodeURIComponent(encodeURIComponent(b3));
    b2 = encodeURIComponent(encodeURIComponent(b2));
    b1 = encodeURIComponent(encodeURIComponent(b1));
    appcode = encodeURIComponent(encodeURIComponent(appcode));
    pagecode = encodeURIComponent(encodeURIComponent(pagecode));
    appid = encodeURIComponent(encodeURIComponent(appid));
    // 面包屑信息及应用编码
    let breadcrumbInfo = `&c=${appcode}&p=${pagecode}&ar=${appid}&n=${b4}&b1=${b1}&b2=${b2}&b3=${b3}`;
    // 参数
    let paramData;
    if (query && typeof(query) === 'string') {
        paramData = `&param=${encodeURIComponent(encodeURIComponent(query))}`;
    }
    if (type !== "own") {
        pageurl = encodeURIComponent(encodeURIComponent(pageurl));
    } else {
        pageurl = pageurl + "?";
    }
    if (win) {
        if (type !== "own") {
            // 浏览器新页签打开业务组应用
            win.location = paramData?`#/ifr?ifr=${pageurl}${breadcrumbInfo}${paramData}`:`#/ifr?ifr=${pageurl}${breadcrumbInfo}`;
            win.focus();
        } else {
            // 浏览器新页签打开workbench自有应用
            win.location = `#/${pageurl}${breadcrumbInfo}`;
            win.focus();
        }
    } else {
        if (type !== "own") {
            // 浏览器当前页打开
            // window.location.hash = `#/ifr?ifr=${pageurl}${breadcrumbInfo}`;
        } else {
            window.location.hash = `#/${pageurl}${breadcrumbInfo}`;
        }
    }
};

/**
 * workbench 内部页面跳转 页面级别 不包含 workbench内部应用
 *@param {String} router 目标路由
 *@param {Boolen} isNewTab 是否新页签打开 默认 false 当前页 true 新页签打开
 *@param {Object} query  需要传递的参数 面包屑参数 b1 > b2 > b3 > n
 *@param {Array} delKeys 需要删除的参数key数组
 */
export const openPage = (router, isNewTab = false, query, delKeys) => {
    // 获取原页面uri
    let urlHashObj = GetQuery(window.location.hash);
    let historyRouter = window.location.hash.split("?")[0].split("#/")[1];
    let isRefresh = false;
    if (historyRouter == "ifr") {
        isRefresh = true;
    }
    let newUri;
    if (query && JSON.stringify(query) != "{}") {
        newUri = { ...query };
    }
    if (newUri && JSON.stringify(newUri) != "{}") {
        newUri = { ...urlHashObj, ...newUri };
    } else {
        newUri = { ...urlHashObj };
    }
    for (const key in newUri) {
        if (newUri.hasOwnProperty(key)) {
            // 删除指定的字段
            if (delKeys && delKeys.length > 0 && delKeys.indexOf(key) > -1) {
                delete newUri[key];
            } else {
                newUri[key] = encodeURIComponent(
                    encodeURIComponent(newUri[key])
                );
            }
        }
    }
    let { searchParam } = CreateQuery(newUri);
    if (router.indexOf("/") === -1 || router[0] != "/") {
        router = `#/${router}`;
    }
    // 新页签打开
    if (isNewTab) {
        let win = window.open("", "_blank");
        win.location = `${router}${searchParam}`;
        win.focus();
    } else {
        if (isRefresh) {
            // 刷新当前页打开
            window.location.hash = `${router}${searchParam}`;
            window.location.reload(true);
        } else {
            // 当前页打开
            window.location.hash = `${router}${searchParam}`;
        }
    }
};

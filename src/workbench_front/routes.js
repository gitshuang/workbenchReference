import React from "react";
import {HashRouter as Router, Route, Link, Switch} from "react-router-dom";
import Loadable from "react-loadable";
import Layout from "./layout";
import Loading from "Components/Loading";
import Home from 'Pages/home';

const Ifr = Loadable({
    loader: () => import("Pages/ifr"),
    loading: Loading
});
const NotFound = Loadable({
    loader: () => import("Pages/404"),
    loading: Loading
});
const DesktopSetting = Loadable({
    loader: () => import("Pages/DesktopSetting"),
    loading: Loading
});
const AppRegister = Loadable({
    loader: () => import("Pages/AppRegister"),
    loading: Loading
});
const AppManagement = Loadable({
    loader: () => import("Pages/AppManagement"),
    loading: Loading
});
const Zone = Loadable({
    loader: () => import("Pages/Zone"),
    loading: Loading
});
const ZoneSetting = Loadable({
    loader: () => import("Pages/ZoneSetting"),
    loading: Loading
});
const ZoneSettingComplete = Loadable({
    loader: () => import("Pages/ZoneSettingComplete"),
    loading: Loading
});
const Customize = Loadable({
    loader: () => import("Pages/Customize"),
    loading: Loading
});
const MenuRegister = Loadable({
    loader: () => import("Pages/MenuRegister"),
    loading: Loading
});
const MenuItem = Loadable({
    loader: () => import("Pages/MenuItem"),
    loading: Loading
});
const TemplateSetting = Loadable({
    loader: () => import("Pages/TemplateSetting"),
    loading: Loading
});
const  TemplateSettingUnit = Loadable({
    loader: () => import("Pages/TemplateSetting-unit"),
    loading: Loading
});
const IndividuationRegister = Loadable({
    loader: () => import("Pages/IndividuationRegister"),
    loading: Loading
});
const UserInfo = Loadable({
    loader: () => import("Pages/UserInfo"),
    loading: Loading
});
const OwnLogInfo = Loadable({
    loader: () => import("Pages/OwnLog"),
    loading: Loading
});
const routes = [
    {
        path: "/",
        exact: true,
        component: Home
    },
    {
        path: "/ifr",
        component: Ifr
    },
    {
        path: "/404",
        component: NotFound
    },
    {
        path: "/ds",
        component: DesktopSetting
    },
    {
        path: "/ar",
        exact: true,
        component: AppRegister
    },
    {
        path: "/am",
        exact: true,
        component: AppManagement
    },
    {
        path: "/ui",
        exact: true,
        component: UserInfo
    },
    {
        path: "/log",
        component: OwnLogInfo
    },
    {
        path: "/Zone",
        component: Zone
    },
    {
        path: "/ZoneSetting",
        component: ZoneSetting
    },
    {
        path: "/ZoneSettingComplete",
        component: ZoneSettingComplete
    },
    {
        path: "/c",
        component: Customize
    },
    {
        path: "/mr",
        component: MenuRegister
    },
    {
        path: "/mi",
        component: MenuItem
    },
    {
        path: "/TemplateSetting",
        component: TemplateSetting
    },
    {
        path:"/TemplateSetting-unit",
        component:TemplateSettingUnit
    },
    {
        path: "/ir",
        component: IndividuationRegister
    }
];
const RouteWithSubRoutes = route => (
    <Route
        path={route.path}
        render={props => (
            // pass the sub-routes down to keep nesting
            <route.component {...props} />
        )}
    />
);

const RouteConfig = () => (
    <Router>
        <Layout>
            <Switch>
                {routes.map((route, i) => (
                    <RouteWithSubRoutes key={i} {...route} />
                ))}
                <Route
                    component={infor => <NotFound location={infor.location} />}
                />
            </Switch>
        </Layout>
    </Router>
);
export default RouteConfig;

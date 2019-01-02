# NC Cloud 工作台 &middot; ![node version](https://img.shields.io/badge/node-8.10.0-brightgreen.svg) ![npm version](https://img.shields.io/badge/npm-5.6.0-blue.svg)  ![webpack version](https://img.shields.io/badge/webpack-4.1.1-blue.svg)
![demo drag](http://op3cmr9ix.bkt.clouddn.com/demo-main/drag%20%282%29.gif)
## 演示地址


## 描述
服务于 NC 各个模块节点页面，各模块节点挂载在工作台中实现整个节点页面的完整性。

## 技术栈
`react + rect-redux + webpack + react-router + ES6/7/8`

## 拖拽依赖
```javascript
react-dnd
```

## 拖拽源码目录结构
`src/workbench_front/pages`
```
DesktopSetting/  // 桌面设置文件夹
├── anchor.js // 锚点组件
├── card.js  // 分组内卡片组件
├── cardListDragPreview.js // 拖拽预览组件
├── collision.js // 碰撞检测
├── compact.js  // 布局排序
├── content.js  // 右侧容器
├── customDragLayer.js // 拖拽
├── footer.js // 下方按钮
├── groupItem.js // 分组组件
├── groupItemHeader.js // 分组头部组件
├── index.js  // 页面入口文件
├── index.less 
├── modal.js 
├── sider.js  // 左侧边栏
├── siderCard.js  // 左侧边栏内卡片组件
└── utilService.js // 工具函数
```



## 启动 (开发模式)
```
npm i

npm run dev

```

## 打包构建 (生产模式)
```
npm run build
```

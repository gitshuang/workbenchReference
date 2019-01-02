let platform;
if (window["nc-lightapp-front"]) {
    platform = window["nc-lightapp-front"];
} else {
    platform = window["platform-workbench"];
}
export default platform;

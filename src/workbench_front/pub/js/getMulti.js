import platform from 'Pub/js/platform';
let {
    getMultiLang
} = platform;
export const getMulti = ({
    moduleId,
    callback,
    domainName = 'workbench'
}) => {
    if (window.location.pathname.split('/').length == 2) {
        getMultiLang({
            environment: 'development',
            domainName,
            moduleId,
            callback
        });
    } else {
        getMultiLang({
            environment: 'production',
            domainName,
            moduleId,
            callback
        });
    }
};
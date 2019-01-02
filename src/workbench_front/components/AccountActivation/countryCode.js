import { langCheck } from 'Pub/js/utils';
export async function gotCountryCode() {
    let countryCodeObj = {
        data: {
            '86': langCheck('0000PUB-000200') /* 国际化处理： 中国*/,
            '852': langCheck('0000PUB-000201') /* 国际化处理： 中国香港*/,
            '853': langCheck('0000PUB-000202') /* 国际化处理： 中国澳门*/,
            '886': langCheck('0000PUB-000203') /* 国际化处理： 中国台湾*/,
            '65': langCheck('0000PUB-000204') /* 国际化处理： 新加坡*/,
            '60': langCheck('0000PUB-000205') /* 国际化处理： 马来西亚*/,
            '62': langCheck('0000PUB-000206') /* 国际化处理： 印度尼西亚*/,
            '66': langCheck('0000PUB-000207') /* 国际化处理： 泰国*/,
            '63': langCheck('0000PUB-000208') /* 国际化处理： 菲律宾*/,
            '84': langCheck('0000PUB-000209') /* 国际化处理： 越南*/,
            '95': langCheck('0000PUB-000210') /* 国际化处理： 缅甸*/
        }
    }; 
    return countryCodeObj
};

import { getCookie } from "Pub/js/utils";
/**
 * 单元格值处理
 * @param {Object} props
 */
export const cellValue = props => {
    let { type, value = "", options, cellMark } = props;
    switch (type) {
        case "string":
            return value;
        case "select":
            let selectItem = options.find(item => item.value === value);
            return selectItem.text;
        case "multiString":
            let locale = getCookie("langCode") || "simpchn";
            let multiStringItem = options.find(
                item => item.languageCode == locale
            );
            return value[`${cellMark}${multiStringItem.index}`].value;
        default:
            return value;
    }
};
/**
 * 单元格非空校验  false - 非空 true - 空
 * @param {String} value
 */
export const cellNonempty = value => {
    if (!value || (value && value.length < 1)) {
        return true;
    } else {
        return false;
    }
};

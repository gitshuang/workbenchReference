import Ajax from "Pub/js/ajax";
import { langCheck } from 'Pub/js/utils';
export default function(props, json) {
    let url, data;
    url = "/nccloud/platform/templet/previewtemplet.do";
    data = {
        templetid: props.templetid
    };
    Ajax({
        url: url,
        data: data,
        info: {
            name: langCheck('ZoneSetting-000028', "pages", json),/* 国际化处理： 模板*/
            action: langCheck('ZoneSetting-000029', "pages", json)/* 国际化处理： 模板预览*/
        },
        success: ({ data: { data } }) => {
            if (data && data.length > 0) {
                let meta = data.reduce((pre, cur, i) => {
                    if (
                        cur[Object.keys(cur)[0]] &&
                        cur[Object.keys(cur)[0]].moduletype === "form"
                    ) {
                        cur[Object.keys(cur)[0]].status = "edit";
                        cur[Object.keys(cur)[0]].items.map(formItem => {
                            if (formItem.col) {
                                if (formItem.col === "0") {
                                    formItem.col = "1";
                                }
                                formItem.col = formItem.col * 6;
                            }
                        });
                    }
                    return { ...pre, ...cur }; // 数组拆开 展开为模板数据格式
                }, {});
                props.meta.setMeta(meta);
                props.updatePreviewData(data);
            }
        }
    });
}

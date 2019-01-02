import _ from "lodash";
/**
 * 创建树形态 数组
 * @param {Array} data 平铺的树数组
 * @param {String} key 每一项的唯一标识
 * @param {String} parentKey 每一项的父节点的标识
 */
export const createTree = (data, key, parentKey) => {
	data = _.cloneDeep(data);
	let { treeArray, treeObject } = dataSeparation(data, parentKey);
	treeObject = dataMerge(treeObject, key);
	return createTreeFun(treeArray, treeObject, key);
};
/**
 * 树平铺数组分离 
 * 将平铺树数组 分离出 treeArray,treeObject
 * treeArray - 树第一层数组 
 * treeObject - 除第一层之外的数据 其 key 为 parentKey 的值， value 为具有相同 parentKey 的数据集合
 * @param {Array} data 
 * @param {String} parentKey 
 */
const dataSeparation = (data, parentKey) => {
	let treeArray = [],
		treeObject = {};
	data.map((item, index) => {
		if (item[parentKey]) {
			if (treeObject.hasOwnProperty(item[parentKey])) {
				treeObject[item[parentKey]].push(item);
			} else {
				treeObject[item[parentKey]] = [];
				treeObject[item[parentKey]].push(item);
			}
		} else {
			treeArray.push(item);
		}
	});
	return { treeArray, treeObject };
};
/**
 * 数据合并 
 * 丰富 treeObject
 * @param {Object} treeObject 
 * @param {String} key 
 */
const dataMerge = (treeObject, key) => {
	for (const treeObjectItemKey in treeObject) {
		if (treeObject.hasOwnProperty(treeObjectItemKey)) {
			treeObject[treeObjectItemKey] = createTreeFun(treeObject[treeObjectItemKey], treeObject, key);
		}
	}
	return treeObject;
};
/**
 * 创建树方法
 * @param {Array} arrayData 
 * @param {Object} objectData 
 * @param {String} key
 */
const createTreeFun = (arrayData, objectData, key) => {
	return arrayData.map((item, inedx) => {
		if (objectData.hasOwnProperty(item[key])) {
			item.children = objectData[item[key]];
		}
		return item;
	});
};

/**
 * 碰撞检测
 * @param {Object} a
 * @param {Object} b
 * @returns {Boolean} 是否碰撞
 */
export const collision = (a, b) => {
    if (
        a.gridx === b.gridx &&
        a.gridy === b.gridy &&
        a.width === b.width &&
        a.height === b.height
    ) {
        return true;
    }
    if (a.gridx + a.width <= b.gridx) return false; //a处于b的左方
    if (a.gridx >= b.gridx + b.width) return false; //a处于b的右方
    if (a.gridy + a.height <= b.gridy) return false; //a处于b的上方
    if (a.gridy >= b.gridy + b.height) return false; //a处于b的下方
    return true;
};
/**
 * 获取layout中，item第一个碰撞到的物体
 * @param {Array} layout
 * @param {Object} item
 * @returns {Object||null} 被碰撞的item或者null
 */
export const getFirstCollision = (layout, item) => {
    for (let i = 0, length = layout.length; i < length; i++) {
        if (collision(layout[i], item)) {
            return layout[i];
        }
    }
    return null;
};
/**
 * 布局检测，递归检测移动过的item和其他item有没有碰撞，如果有Y坐标下移/X坐标右移
 * @param {Array} layout
 * @param {Object} layoutItem
 * @param {String} cardID
 * @param {String} fristItemID
 * @param {String} axis 'gridx'或者'gridy',不同的布局方式
 * @returns {Object||null} 被碰撞的item或者null
 */
export const layoutCheck = (function() {
    const _layoutCheck = function(
        layout,
        layoutItem,
        cardID,
        fristItemID,
        axis
    ) {
        let keyArr = [];
        let movedItem = [];
        axis = axis || "gridx";
        let newlayout = layout.map((item, index) => {
            if (item.cardid !== cardID) {
                if (collision(item, layoutItem)) {
                    //碰撞检测，是否有方块和当前卡片有位置碰撞
                    keyArr.push(item.cardid);
                    let offsetXY = item[axis] + 1;
                    // 移动模块位于循环检测方块中
                    let widthOrHeight = 0;
                    if (axis === "gridx") {
                        widthOrHeight = item.width;
                    } else {
                        widthOrHeight = item.height;
                    }
                    //判断当前卡片的坐标和目标卡片加上宽度/高度是否有重叠，防止重叠产生
                    if (
                        layoutItem[axis] > item[axis] &&
                        layoutItem[axis] < item[axis] + widthOrHeight
                    ) {
                        offsetXY = item[axis];
                    }
                    let newItem = { ...item };
                    newItem[axis] = offsetXY;
                    movedItem.push(newItem);
                    return newItem;
                }
            } else if (fristItemID === cardID) {
                return { ...item, ...layoutItem };
            }
            return item;
		});
		//循环所有移动过的卡片，通过碰撞检测影响的相关卡片，全部进行横坐标/纵坐标偏移
        for (let c = 0, length = movedItem.length; c < length; c++) {
            newlayout = _layoutCheck(
                newlayout,
                movedItem[c],
                keyArr[c],
                fristItemID,
                axis
            );
        }

        return newlayout;
    };
    return _layoutCheck;
})();

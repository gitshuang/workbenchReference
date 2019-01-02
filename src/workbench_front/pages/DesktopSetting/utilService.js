import _ from "lodash";

/**
 * 通过分组ID获取分组对象
 * @param {Array} groups
 * @param {String} groupID
 * @return {Object} group
 */
export const getGroupByGroupID = (groups, groupID) => {
    let tmpGroup = {};
    _.forEach(groups, g => {
        if (g.pk_app_group === groupID) {
            tmpGroup = g;
            return false;
        }
    });
    return tmpGroup;
};

/**
 * 通过分组ID获取分组的Index
 * @param {Array} groups
 * @param {String} groupID
 * @return {Int} group的Index
 */
export const getGroupIndexByGroupID = (groups, groupID) => {
    let tmpIndex;
    _.forEach(groups, (g, i) => {
        if (g.pk_app_group === groupID) {
            tmpIndex = i;
            return false;
        }
    });
    return tmpIndex;
};

/**
 * 通过GroupID找到某个组，通过CardID找到该组内的卡片对象
 * @param {Array} groups
 * @param {String} groupID
 * @param {String} cardID
 * @return {Object} 目标卡片对象
 */
export const getCardByGroupIDAndCardID = (groups, groupID, cardID) => {
    let tmpGroup = {};
    let resultCard = {};
    _.forEach(groups, g => {
        if (g.pk_app_group === groupID) {
            tmpGroup = g;
            return false;
        }
    });
    _.forEach(tmpGroup.apps, a => {
        if (a.cardid === cardID) {
            resultCard = a;
            return false;
        }
    });
    return resultCard;
};

/**
 * 从分组中删除卡片
 * @param {Array} groups
 * @param {String} cardID
 * @return {Object} 被删除的卡片对象
 */
export const removeCardInGroupByCardID = (group, cardID) => {
    let resultCardArr = [];
    resultCardArr = _.remove(group.apps, a => {
        return a.cardid === cardID;
    });
    return resultCardArr[0];
};

/**
 * 从某个分组中删除卡片
 * @param {Array} groups
 * @param {Int} groupIndex
 * @param {String} cardID
 * @return {Object} 被删除的卡片对象
 */
export const removeCardByGroupIndexAndCardID = (groups, groupIndex, cardID) => {
    let tmpGroupIndex = groupIndex;
    let resultCardArr = [];
    resultCardArr = _.remove(groups[tmpGroupIndex].apps, a => {
        return a.cardid === cardID;
    });
    return resultCardArr[0];
};

/**
 * 以组为单位，设置卡片属性值
 * @param {Array} groups
 * @param {String} property
 * @param {*} value
 */
export const setPropertyValueForCards = (groups, property, value) => {
    _.forEach(groups, (g, index) => {
        _.forEach(g.apps, a => {
            a[property] = value;
        });
    });
};

/**
 * 以卡片为单位，设置卡片属性值
 * @param {Array} cards
 * @param {String} property
 * @param {*} value
 */
export const setPropertyValueForCardsInCards = (cards, property, value) => {
    _.forEach(cards, a => {
        a[property] = value;
    });
};

/**
 * 检查卡片是否在组内包含
 * @param {Array} groups
 * @param {String} cardID
 * @returns {Boolean}
 */
export const checkCardContainInGroup = (groups, cardID) => {
    let tmpFlag = false;
    _.forEach(groups.apps, a => {
        if (a.cardid === cardID && a.isShadow === false) {
            tmpFlag = true;
        }
    });
    return tmpFlag;
};
/**
 * 获得新添加组的数字
 * @param {Array} groups
 * @param {Int} myCount
 * @returns {Int}
 */
export const getNewGroupItemNum = (groupNameNation, groups, myCount) => {
    let count = myCount || 1;
    let existFlag = false;
    _.forEach(groups, g => {
        if (g.groupname === `${groupNameNation}(${count})`) {/* 国际化处理： 分组*/
            existFlag = true;
            return false;
        }
    });
    if (existFlag) {
        return getNewGroupItemNum(groupNameNation, groups, ++count);
    } else {
        return count;
    }
};

export const setGridXGridYMaxInCards = cardList => {
    _.forEach(cardList, c => {
        c.gridy = 999;
    });
};

/**
 * 已知放置格子数量, 计算容器的每一个格子多大
 * @param {Number} containerWidth
 * @param {Number} col
 * @param {Number} containerPadding
 * @param {Number} margin
 * @returns {Number} 单元格大小
 */
export const calColWidth = (containerWidth, col, containerPadding, margin) => {
    if (margin) {
        return (
            (containerWidth - containerPadding[0] * 2 - margin[0] * (col + 1)) /
            col
        );
    }
    return (containerWidth - containerPadding[0] * 2 - 0 * (col + 1)) / col;
};

/**
 * 已知格子大小，计算容器一行放置格子数量
 * @param {Number} defaultCalWidth
 * @param {Number} containerWidth
 * @param {Number} containerPadding
 * @param {Number} margin
 * @returns {Number} 每行单元格数量
 */
export const calColCount = (
    defaultCalWidth,
    containerWidth,
    containerPadding,
    margin
) => {
    if (margin) {
        return Math.floor(
            (containerWidth - containerPadding[0] * 2 - margin[0]) /
                (defaultCalWidth + margin[0])
        );
    }
};

/**
 * 计算横向的长度
 * @param {Array} layout
 * @returns {Number} 最大长度
 */
export const layoutHorizontalRowLength = layout => {
    let max = 0,
        rowX;
    for (let i = 0, len = layout.length; i < len; i++) {
        rowX = layout[i].gridx + layout[i].width;
        if (rowX > max) max = rowX;
    }
    return max;
};

/**
 * 获得当前layout中最底单元格的Y坐标
 * @param {Array} layout
 * @returns {Number} 最底单元格Y坐标
 */
export const layoutBottom = layout => {
    let max = 0,
        bottomY;
    for (let i = 0, len = layout.length; i < len; i++) {
        bottomY = layout[i].gridy + layout[i].height;
        if (bottomY > max) max = bottomY;
    }
    return max;
};

/**
 * 计算卡片容器的最大高度
 * @param {Array} cards
 * @param {Number} rowHeight
 * @param {Number} margin
 * @returns {Number} 容器高度
 */
export const getContainerMaxHeight = (cards, rowHeight, margin) => {
    const resultRow = layoutBottom(cards);
    return resultRow * rowHeight + (resultRow - 1) * margin[1] + 2 * margin[1];
};

/**
 * 给予一个grid的位置，算出元素具体的在容器中位置在哪里，单位是px
 * @param {Number} gridx
 * @param {Number} gridy
 * @param {Number} margin
 * @param {Number} rowHeight
 * @param {Number} calWidth
 * @returns {Object} 包含x，y坐标的对象
 */
export const calGridItemPosition = (
    gridx,
    gridy,
    margin,
    rowHeight,
    calWidth
) => {
    const x = Math.round(gridx * calWidth + margin[0] * (gridx + 1));
    const y = Math.round(gridy * rowHeight + margin[1] * (gridy + 1));
    return {
        x: x,
        y: y
    };
};

/**
 * 防止元素溢出容器
 * @param {Int} gridX
 * @param {Int} gridY
 * @param {Int} col
 * @param {Int} w 卡片宽度
 * @returns {Object} gridX，gridY的单元格坐标对象
 */
export const checkInContainer = (gridX, gridY, col, w) => {
    if (gridX + w > col - 1) gridX = col - w; //右边界
    if (gridX < 0) gridX = 0; //左边界
    if (gridY < 0) gridY = 0; //上边界
    return { gridX, gridY };
};

/**
 * 通过坐标x，y像素值计算所在的单元格坐标
 * @param {Number} x
 * @param {Number} y
 * @param {Number} cardWidth
 * @param {Number} margin
 * @param {Number} containerWidth
 * @param {Number} col
 * @param {Number} rowHeight
 * @returns {Object} 包含gridx和gridy的单元格坐标的对象
 */
export const calGridXY = (
    x,
    y,
    cardWidth,
    margin,
    containerWidth,
    col,
    rowHeight
) => {
    //坐标转换成格子的时候，向下取整，无须计算margin
    let gridX = Math.floor((x / containerWidth) * col);
    let gridY = Math.floor(y / (rowHeight + (margin ? margin[1] : 0)));
    //防止卡片溢出容器
    return checkInContainer(gridX, gridY, col, cardWidth);
};

/**
 * 宽和高计算成为px
 * @param {Number} w
 * @param {Number} h
 * @param {Number} margin
 * @param {Number} rowHeight
 * @param {Number} cardWidth
 * @returns {Object} 包含wPx, hPx的对象
 */
export const calWHtoPx = (w, h, margin, rowHeight, calWidth) => {
    const wPx = Math.round(w * calWidth + (w - 1) * margin[0]);
    const hPx = Math.round(h * rowHeight + (h - 1) * margin[1]);
    return { wPx, hPx };
};

/**
 * 判断是否有滚动条
 * @param {Element} el Dom元素
 * @param {*}
 * @returns {Boolean}
 */
export const hasScrolled = (el, direction = "vertical") => {
    if (direction === "vertical") {
        return el.scrollHeight > el.clientHeight;
    } else if (direction === "horizontal") {
        return el.scrollWidth > el.clientWidth;
    }
};

/**
 * 判断分组内是否有选中的卡片
 * @param {Array} groups
 * @returns {Boolean}
 */
export const hasCheckedCardInGroups = groups => {
    let flag = false;
    _.forEach(groups, g => {
        _.forEach(g.apps, a => {
            if (a.isChecked === true) {
                flag = true;
                return false;
            }
        });
        if (flag) {
            return false;
        }
    });
    return flag;
};

/**
 * 判断分组内是否有过期的卡片
 * @param {Array} groups
 * @returns {Boolean}
 */
export const hasExpiredCardInGroups = groups => {
    let flag = false;
    _.forEach(groups, g => {
        _.forEach(g.apps, a => {
            if (a.haspower === false) {
                flag = true;
                return false;
            }
        });
        if (flag) {
            return false;
        }
    });
    return flag;
};

/**
 * 删除目标若干卡片
 * @param {Array} groups
 * @param {String} property 属性
 * @param {*} value 值
 */
export const removeTargetCardsInGroup = (groups, property, value) => {
    _.forEach(groups, g => {
        _.remove(g.apps, a => {
            return a[property] === value;
        });
    });
};

/**
 * 获得RelateObj
 * @param {String} pk_responsibility
 * @param {*} userID
 * @returns {Object}
 */
export const getRelateidObj = (pk_responsibility, is_group) => {
    let relateidObj;
    //0职责 1用户 2集团
    if (pk_responsibility) {
        relateidObj = {
            data: pk_responsibility,
            code: "0",
            type: "responsibility"
        };
    } else if (is_group) {
        relateidObj = {
            data: Boolean(is_group),
            code: "2",
            type: "is_group"
        };
    } else {
        relateidObj = {
            data: "",
            code: "1",
            type: "userID"
        };
    }
    return relateidObj;
};
/**
 * 判断所有分组内是否有某卡片
 * @param {Array} groups
 * @param {String} cardID
 * @returns {Boolean}
 */
export const hasCardContainInGroups = (groups, cardID) => {
    let flag = false;
    _.forEach(groups, g => {
        _.forEach(g.apps, a => {
            if (a.cardid === cardID) {
                flag = true;
                return false;
            }
        });
        if (flag) {
            return false;
        }
    });
    return flag;
};

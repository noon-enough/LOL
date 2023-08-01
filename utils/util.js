import {DEFAULT_SESSION, FEEDBACK_APPID, LOL_CONFIG, OBJECT, SESSION, SESSION_SET} from "./config";

/**
 * 跳转
 * @param url
 */
function goto(url) {
    console.log("goto", url)
    wx.navigateTo({
        url: url,
    })
}

/**
 * 跳转到英雄详细页面
 * @param id
 */
function heroDetail(id) {
    goto(`/pages/detail/index?id=${id}`)
}


/**
 * 打开意见反馈
 */
function gotoFeedback() {
    wx.openEmbeddedMiniProgram({
        appId: FEEDBACK_APPID,
        envVersion: "release",
        extraData: {
            "id": OBJECT
        }
    })
}

function historyBack(success = function (){} ) {
    const pages = getCurrentPages();
    if (pages.length >= 2) {
        wx.navigateBack({
            delta: 1,
            success: success,
        })
    } else {
        wx.switchTab({
            url: "/pages/index/index"
        })
    }
}

/**
 * 弹窗
 * @param msg
 * @param icon
 */
function showToast(msg, {icon = 'success'}) {
    wx.showToast({
        title: msg,
        icon: icon,
    })
}

function getPositions(positions = []) {
    let p = positions.map((item) => {
        item = getNameByType(LOL_CONFIG.hero_pos, item)
        return item
    })

    return p.join(",")
}

function getJobs(jobs = []) {
    let p = jobs.map((item) => {
        item = getNameByType(LOL_CONFIG.hero_job, item)
        return item
    })

    return p.join(",")
}


function getNameByType(configArray, type) {
    const item = configArray.find((item) => item.type === type);
    return item ? item.name : null;
}

/**
 *
 * @type {{goto: goto, heroDetail: heroDetail, getSessionName: (function(string=): string), showToast: showToast, getSession: (function(*): string), gotoFeedback: gotoFeedback, getSessionFromStorage: (function(): *), lineupDetail: lineupDetail}}
 */
module.exports = {historyBack, goto, heroDetail, gotoFeedback,
    showToast, getPositions, getNameByType, getJobs}

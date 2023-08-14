import deviceUtil from "/miniprogram_npm/lin-ui/utils/device-util"
import tabbar from "./tabbar"

App({
    onLaunch(key, data) {
        let width = wx.getSystemInfoSync().windowWidth,
            height = wx.getSystemInfoSync().windowHeight,
            that = this,
            navigationBarHeight = deviceUtil.getNavigationBarHeight(),
            statusBarHeight = deviceUtil.getStatusBarHeight(),
            titleBarHeight = deviceUtil.getTitleBarHeight()

        that.globalData.system = {
            width: width,
            height: height,
            navigationBarHeight: navigationBarHeight,
            statusBarHeight: statusBarHeight,
            titleBarHeight: titleBarHeight,
        }
    },
    globalData: {
        tabbar: tabbar,
        system: {
            width: 0,
            height: 0,
            navigationBarHeight: 0,
            statusBarHeight: 0,
            titleBarHeight: 0,
        },
        heroes: {
            job: "all",
            pos: "all"
        },
        index: {
            lane: "all",
            highlight: 0,
        }
    },
})

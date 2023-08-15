import {NICKNAME, TFT} from "../../utils/config";
import {getIsShowNickname, getIsShowTFT} from "../../utils/util";

const app = getApp()
Page({
    data: {
        list: app.globalData.tabbar,
        tft: true,
        nickname: true,
    },
    onLoad: function (options) {
        let that = this,
            tft = getIsShowTFT(),
            nickname = getIsShowNickname()

        console.log('nickname', nickname, 'tft', tft)
        that.setData({
            tft: !!tft,
            nickname: !!nickname,
        })
    },
    onCommentPlugin(e) {
        const plugin = requirePlugin("wxacommentplugin")
        plugin.openComment({
            success: (res)=>{
                console.log('plugin.openComment success', res)
            },
            fail: (res) =>{
                console.log('plugin.openComment fail', res)
            }
        })
    },
    onSwitch(e) {
        let that = this,
            type = e.currentTarget.dataset.type ?? "nickname",
            value = e.detail.value ?? 0,
            data = {}
        value = !!value
        console.log('onSwitch', 'type', type, 'value', value)
        if (type === "nickname") {
            data.nickname = value
            wx.setStorageSync(NICKNAME, value)
        } else if (type === "tft") {
            data.tft = value
            wx.setStorageSync(TFT, value)
        }
        that.setData(data)
    }
});
